/**
 * @file import-export.js
 * @description Safe JSON Import and Full Device Backup / Restore module for Parent Studio.
 * @module parent/import-export
 */

import { createElement, onTouch } from '../utils/dom.js';
import { db } from '../storage/database.js';
import { validateImportData } from '../utils/validation.js';

export function renderImportExport(container) {
  container.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="bg-white p-6 rounded-2xl border border-gray-200">
        <h1 class="text-2xl font-black text-gray-900 mb-1">Backup &amp; Restore</h1>
        <p class="text-xs text-gray-500">Backup your custom questions, child progress, and media to your device or restore from a previous backup.</p>
      </div>

      <!-- Device Storage Notice -->
      <div class="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl flex items-start gap-3">
        <span class="text-2xl">⚠️</span>
        <div class="text-xs text-amber-900 leading-relaxed">
          <strong>Device-Only Storage:</strong> All created questions, audio recordings, and learning progress are stored privately in this browser's IndexedDB. We recommend downloading a backup regularly so you never lose your family's activities if browser history is cleared.
        </div>
      </div>

      <!-- Full Backup Section -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">📦</span>
          <div>
            <h2 class="text-base font-bold text-gray-900">Complete Device Backup</h2>
            <p class="text-xs text-gray-500">Download everything: questions, collections, child profiles, progress, and uploaded media.</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <button id="btn-export-full" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm min-h-[44px]">
            📦 Download Full Backup
          </button>
          <button id="btn-export-questions" class="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm min-h-[44px]">
            📄 Export Questions Only
          </button>
        </div>
      </div>

      <!-- Restore Section -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">📥</span>
          <div>
            <h2 class="text-base font-bold text-gray-900">Restore from File</h2>
            <p class="text-xs text-gray-500">Restore a complete backup file or import question collections.</p>
          </div>
        </div>
        <input type="file" id="import-file-input" accept=".json,application/json" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer">

        <div id="import-status-box" class="hidden p-4 rounded-xl text-sm font-medium"></div>

        <button id="btn-import-confirm" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm min-h-[44px]">
          Confirm &amp; Restore
        </button>
      </div>
    </div>
  `;

  // Full backup export handler
  const fullExportBtn = container.querySelector('#btn-export-full');
  if (fullExportBtn) {
    onTouch(fullExportBtn, async () => {
      try {
        const fullBackup = await db.backup.createFullBackup();
        const jsonStr = JSON.stringify(fullBackup, null, 2);
        downloadFile(jsonStr, `little_explorers_backup_${new Date().toISOString().slice(0, 10)}.json`);
      } catch (err) {
        alert('Failed to generate full backup: ' + err.message);
      }
    });
  }

  // Questions-only export handler
  const questionsExportBtn = container.querySelector('#btn-export-questions');
  if (questionsExportBtn) {
    onTouch(questionsExportBtn, async () => {
      try {
        const all = await db.questions.getAll();
        const jsonStr = JSON.stringify(all, null, 2);
        downloadFile(jsonStr, `little_explorers_questions_${new Date().toISOString().slice(0, 10)}.json`);
      } catch (err) {
        alert('Failed to export questions: ' + err.message);
      }
    });
  }

  function downloadFile(content, fileName) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Restore & Import handler
  const importInput = container.querySelector('#import-file-input');
  const confirmBtn = container.querySelector('#btn-import-confirm');
  const statusBox = container.querySelector('#import-status-box');

  let parsedToImport = null;
  let isFullBackup = false;

  importInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        statusBox.classList.remove('hidden');

        if (json.appName === 'Little Explorers' && json.data) {
          // Full backup format
          isFullBackup = true;
          parsedToImport = json;
          const actCount = json.data.activities?.length || 0;
          statusBox.className = 'p-4 rounded-xl text-sm font-medium bg-emerald-50 border border-emerald-200 text-emerald-800';
          statusBox.textContent = `Valid Complete Backup detected with ${actCount} activities, child profiles, and progress ready to restore.`;
        } else {
          // Question array or single question format
          isFullBackup = false;
          const result = validateImportData(reader.result);
          if (!result.valid) {
            statusBox.className = 'p-4 rounded-xl text-sm font-medium bg-rose-50 border border-rose-200 text-rose-800';
            statusBox.textContent = 'Import validation failed: ' + result.errors.join(', ');
            parsedToImport = null;
          } else {
            statusBox.className = 'p-4 rounded-xl text-sm font-medium bg-emerald-50 border border-emerald-200 text-emerald-800';
            statusBox.textContent = `Valid file detected with ${result.data.length} activities ready to import.`;
            parsedToImport = result.data;
          }
        }
      } catch (err) {
        statusBox.classList.remove('hidden');
        statusBox.className = 'p-4 rounded-xl text-sm font-medium bg-rose-50 border border-rose-200 text-rose-800';
        statusBox.textContent = 'Invalid JSON file: ' + err.message;
        parsedToImport = null;
      }
    };
    reader.readAsText(file);
  });

  if (confirmBtn) {
    onTouch(confirmBtn, async () => {
      if (!parsedToImport) {
        alert('Please choose a valid JSON backup file first.');
        return;
      }
      try {
        if (isFullBackup) {
          await db.backup.restoreFullBackup(parsedToImport);
          alert('Full backup restored successfully! 🎉 All activities, profiles and progress have been restored.');
        } else {
          await db.questions.importMany(parsedToImport);
          alert(`Successfully imported ${parsedToImport.length} questions into your library! 🎉`);
        }
        parsedToImport = null;
        statusBox.classList.add('hidden');
        importInput.value = '';
      } catch (err) {
        alert('Error restoring data: ' + err.message);
      }
    });
  }
}
