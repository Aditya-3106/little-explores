/**
 * @file child-dashboard.js
 * @description Main Child Learning Playground dashboard with 6 worlds, Milo, and large touch cards.
 * @module child/child-dashboard
 */

import { createElement, onTouch } from '../utils/dom.js';
import { getMiloSVG } from './milo-mascot.js';
import { LEARNING_WORLDS } from '../core/config.js';
import { navigateTo } from '../core/router.js';
import { t } from '../i18n/language-manager.js';

export function renderChildDashboard(container) {
  const currentLang = window.currentLang || 'en';

  container.innerHTML = `
    <div class="child-dashboard max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-6">
      <!-- Milo Greeting Banner -->
      <div class="bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 border-3 border-amber-300 rounded-3xl p-6 shadow-md flex items-center gap-6">
        <div class="flex-shrink-0 animate-bounce-gentle">
          ${getMiloSVG('wave', 110)}
        </div>
        <div class="space-y-2">
          <h1 class="text-2xl md:text-3xl font-black text-amber-950">
            ${currentLang === 'mr' ? 'नमस्ते दोस्ता! चला खेळूया!' : 'Hello, Little Explorer!'}
          </h1>
          <p class="text-amber-900 font-semibold text-base md:text-lg">
            ${currentLang === 'mr' ? 'आज कोणते नवीन जग शोधायचे आहे?' : 'Which magical world shall we explore today?'}
          </p>
        </div>
      </div>

      <!-- 6 Learning Worlds Grid -->
      <div>
        <h2 class="text-xl font-black text-gray-800 mb-4 px-2">
          ${currentLang === 'mr' ? 'शिकण्याची जगते 🌍' : 'Learning Worlds 🌍'}
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          ${LEARNING_WORLDS.map((world) => {
            const name = world.name?.[currentLang] || world.name?.en || world.id;
            const desc = world.description?.[currentLang] || world.description?.en || '';
            return `
              <button data-world-id="${world.id}" class="world-card p-5 rounded-3xl border-3 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer min-h-[160px] bg-white" style="border-color: ${world.color}40;">
                <div class="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mb-3 shadow-sm" style="background-color: ${world.color}20;">
                  ${world.icon}
                </div>
                <h3 class="text-lg md:text-xl font-black text-gray-900 mb-1 leading-tight">${name}</h3>
                <p class="text-xs text-gray-500 font-medium line-clamp-2">${desc}</p>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Quick Achievements link -->
      <div class="flex justify-between items-center bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 shadow-sm">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🏆</span>
          <span class="font-bold text-purple-950">${currentLang === 'mr' ? 'तुमची पदके पहा' : 'View Your Badges'}</span>
        </div>
        <button id="btn-child-achievements" class="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl shadow-xs hover:bg-purple-700 min-h-[44px]">
          ${currentLang === 'mr' ? 'पहा ✨' : 'View ✨'}
        </button>
      </div>
    </div>
  `;

  // Attach navigation handlers
  container.querySelectorAll('.world-card').forEach((card) => {
    onTouch(card, () => {
      const worldId = card.dataset.worldId;
      navigateTo(`/play/world/${worldId}`);
    });
  });

  const achBtn = container.querySelector('#btn-child-achievements');
  if (achBtn) {
    onTouch(achBtn, () => {
      navigateTo('/play/achievements');
    });
  }
}

