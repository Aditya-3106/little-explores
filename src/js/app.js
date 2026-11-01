/**
 * @file app.js
 * @description Main application entry point for Little Explorers.
 * Coordinates routing, storage, i18n, seed activities, and responsive UI rendering.
 * @module app
 */

import { router } from './core/router.js';
import { db } from './storage/database.js';
import { i18n } from './i18n/language-manager.js';
import enTranslations from './i18n/en.js';
import mrTranslations from './i18n/mr.js';
import { initializeActivityTypes } from './activities/activity-init.js';
import { ALL_SEED_ACTIVITIES } from '../../data/seed-activities/index.js';

// Child view renderers
import { renderChildDashboard } from './child/child-dashboard.js';
import { renderWorldDetail } from './child/learning-worlds.js';
import { startGameSession } from './child/game-session.js';
import { renderBadges } from './child/achievements.js';

// Parent view renderers
import { renderParentGate, isParentUnlocked } from './parent/parent-gate.js';
import { renderParentDashboard } from './parent/parent-dashboard.js';
import { renderQuestionBuilder } from './parent/question-builder.js';
import { renderQuestionLibrary } from './parent/question-library.js';
import { renderCollections } from './parent/collections.js';
import { renderImportExport } from './parent/import-export.js';
import { renderChildProfiles } from './parent/child-profiles.js';
import { renderProgressReport } from './parent/progress-report.js';

// Global state
window.currentLang = localStorage.getItem('le_lang') || 'en';

export async function bootstrapApp() {
  // 1. Initialize i18n
  i18n.loadTranslations('en', enTranslations);
  i18n.loadTranslations('mr', mrTranslations);
  i18n.setLanguage(window.currentLang);

  // Show device-storage reminder on first visit
  showStorageReminder();

  // 2. Initialize Activity Registry
  initializeActivityTypes();

  // 3. Initialize IndexedDB & Seed default activities
  try {
    await db.init();
    const existing = await db.questions.getAll();
    if (existing.length === 0) {
      console.log('Seeding initial educator-designed activities...');
      await db.questions.importMany(ALL_SEED_ACTIVITIES);
    }
  } catch (err) {
    console.warn('Storage initialisation note:', err);
  }

  // 4. Setup Routes
  setupRoutes();

  // 5. Start router
  router.listen();
}

function getAppContainer() {
  return document.getElementById('playground-app') ||
    document.getElementById('parent-app') ||
    document.getElementById('app') ||
    document.body;
}

function setupRoutes() {
  // ── Child Playground Routes ──────────────────────────────────────────
  router.register('/', () => {
    // If on play.html, default to child dashboard
    const container = getAppContainer();
    renderChildDashboard(container);
  });

  router.register('/play', () => {
    const container = getAppContainer();
    renderChildDashboard(container);
  });

  router.register('/play/world/:worldId', (params) => {
    const container = getAppContainer();
    renderWorldDetail(params.worldId, container);
  });

  router.register('/play/activity/:activityId', (params) => {
    const container = getAppContainer();
    startGameSession(params.activityId, container);
  });

  router.register('/play/achievements', () => {
    const container = getAppContainer();
    container.innerHTML = `
      <div class="max-w-xl mx-auto p-4">
        <button id="ach-back" class="mb-4 px-4 py-2 bg-white border rounded-xl font-bold">← Back to Worlds</button>
        <div id="badges-mount"></div>
      </div>
    `;
    container.querySelector('#ach-back').addEventListener('click', () => {
      router.navigate('/play');
    });
    renderBadges(container.querySelector('#badges-mount'), ['first_step', 'math_star'], window.currentLang);
  });

  // ── Parent Studio Routes ─────────────────────────────────────────────
  router.register('/parent', () => {
    const container = getAppContainer();
    if (isParentUnlocked()) {
      router.navigate('/parent/dashboard');
    } else {
      renderParentGate(container, () => router.navigate('/parent/dashboard'));
    }
  });

  router.register('/parent/dashboard', () => {
    const container = getAppContainer();
    if (!isParentUnlocked()) {
      renderParentGate(container, () => router.navigate('/parent/dashboard'));
      return;
    }
    renderParentDashboard(container);
  });

  router.register('/parent/create', () => {
    const container = getAppContainer();
    if (!isParentUnlocked()) {
      renderParentGate(container, () => router.navigate('/parent/create'));
      return;
    }
    renderQuestionBuilder(container);
  });

  router.register('/parent/questions', () => {
    const container = getAppContainer();
    if (!isParentUnlocked()) {
      renderParentGate(container, () => router.navigate('/parent/questions'));
      return;
    }
    renderQuestionLibrary(container);
  });

  router.register('/parent/collections', () => {
    const container = getAppContainer();
    if (!isParentUnlocked()) {
      renderParentGate(container, () => router.navigate('/parent/collections'));
      return;
    }
    renderCollections(container);
  });

  router.register('/parent/import-export', () => {
    const container = getAppContainer();
    if (!isParentUnlocked()) {
      renderParentGate(container, () => router.navigate('/parent/import-export'));
      return;
    }
    renderImportExport(container);
  });

  router.register('/parent/profiles', () => {
    const container = getAppContainer();
    if (!isParentUnlocked()) {
      renderParentGate(container, () => router.navigate('/parent/profiles'));
      return;
    }
    renderChildProfiles(container);
  });

  router.register('/parent/progress', () => {
    const container = getAppContainer();
    if (!isParentUnlocked()) {
      renderParentGate(container, () => router.navigate('/parent/progress'));
      return;
    }
    renderProgressReport(container);
  });

  // Edit existing activity
  router.register('/parent/edit/:activityId', async (params) => {
    const container = getAppContainer();
    if (!isParentUnlocked()) {
      renderParentGate(container, () => router.navigate(`/parent/edit/${params.activityId}`));
      return;
    }
    try {
      const activity = await db.questions.getById(params.activityId);
      if (!activity) {
        container.innerHTML = `<div class="p-8 text-center text-red-500 font-bold">Activity not found.</div>`;
        return;
      }
      renderQuestionBuilder(container, activity);
    } catch (err) {
      container.innerHTML = `<div class="p-8 text-center text-red-500">Error loading activity: ${err.message}</div>`;
    }
  });

  // Settings stub
  router.register('/parent/settings', () => {
    const container = getAppContainer();
    if (!isParentUnlocked()) {
      renderParentGate(container, () => router.navigate('/parent/settings'));
      return;
    }
    container.innerHTML = `
      <div class="max-w-xl mx-auto p-6">
        <h1 class="text-2xl font-black text-gray-900 mb-4">Settings</h1>
        <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div>
            <h2 class="font-bold text-gray-700 mb-2">Language</h2>
            <div class="flex gap-3">
              <button onclick="localStorage.setItem('le_lang','en');location.reload();" class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-xl font-bold">English</button>
              <button onclick="localStorage.setItem('le_lang','mr');location.reload();" class="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-xl font-bold">मराठी</button>
            </div>
          </div>
          <div>
            <h2 class="font-bold text-gray-700 mb-2">Change Parent PIN</h2>
            <p class="text-sm text-gray-500">Go to the Parent Studio gate and use the "Forgot PIN" option.</p>
          </div>
          <div>
            <h2 class="font-bold text-red-600 mb-2">Storage Notice</h2>
            <p class="text-sm text-gray-600">All questions and progress are stored on <strong>this device only</strong>. Use Import / Export to back up your data.</p>
          </div>
        </div>
      </div>
    `;
  });

  // 404 fallback
  router.setNotFound(() => {
    const container = getAppContainer();
    renderChildDashboard(container);
  });
}

/**
 * Show a one-time device-storage reminder banner.
 * Respects user dismissal (stored in localStorage).
 */
function showStorageReminder() {
  if (localStorage.getItem('le_storage_noted') === '1') return;
  const banner = document.createElement('div');
  banner.id = 'storage-reminder';
  banner.setAttribute('role', 'alert');
  banner.style.cssText = [
    'position:fixed', 'bottom:12px', 'left:50%', 'transform:translateX(-50%)',
    'background:#1e3a5f', 'color:#fff', 'border-radius:16px',
    'padding:14px 20px', 'font-size:13px', 'font-family:sans-serif',
    'max-width:90vw', 'width:440px', 'box-shadow:0 4px 24px rgba(0,0,0,.35)',
    'z-index:9999', 'display:flex', 'align-items:flex-start', 'gap:12px',
    'line-height:1.5'
  ].join(';');
  banner.innerHTML = `
    <span style="font-size:22px;flex-shrink:0">💾</span>
    <div style="flex:1">
      <strong>Questions &amp; progress are stored on this device only.</strong><br>
      Use <em>Import / Export</em> in Parent Studio to back up your data before clearing your browser.
    </div>
    <button id="close-storage-reminder" aria-label="Dismiss"
      style="background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:8px;padding:4px 10px;cursor:pointer;flex-shrink:0;font-size:14px;line-height:1.8">✕</button>
  `;
  document.body.appendChild(banner);
  document.getElementById('close-storage-reminder').addEventListener('click', () => {
    banner.remove();
    localStorage.setItem('le_storage_noted', '1');
  });
  // Auto-dismiss after 12 seconds
  setTimeout(() => {
    if (banner.isConnected) {
      banner.remove();
      localStorage.setItem('le_storage_noted', '1');
    }
  }, 12000);
}

// Auto-bootstrap on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}

