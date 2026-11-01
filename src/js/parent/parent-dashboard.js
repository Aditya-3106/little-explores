/**
 * @file parent-dashboard.js
 * @description Parent Studio Dashboard overview with statistics, quick actions, and recent activities.
 * @module parent/parent-dashboard
 */

import { createElement, onTouch } from '../utils/dom.js';
import { db } from '../storage/database.js';
import { navigateTo } from '../core/router.js';

export async function renderParentDashboard(container) {
  const allQuestions = await db.questions.getAll();
  const collections = await db.collections.getAll();
  const childProfiles = await db.profiles.getAll();

  const publishedCount = allQuestions.filter((q) => q.status === 'published').length;
  const draftCount = allQuestions.filter((q) => q.status === 'draft').length;
  const recentQuestions = [...allQuestions].reverse().slice(0, 5);

  container.innerHTML = `
    <div class="parent-dashboard space-y-6">
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 class="text-2xl font-black text-gray-900">Parent Studio</h1>
          <p class="text-sm text-gray-500">Create, customize, and organize learning activities for your child.</p>
        </div>
        <div class="flex gap-3">
          <button id="pd-btn-create" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-2 text-sm min-h-[44px]">
            <span>➕ Create Question</span>
          </button>
          <button id="pd-btn-switch-child" class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm min-h-[44px]">
            👶 Child Playground
          </button>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Questions</div>
          <div class="text-3xl font-black text-gray-900">${allQuestions.length}</div>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Published</div>
          <div class="text-3xl font-black text-emerald-600">${publishedCount}</div>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Drafts</div>
          <div class="text-3xl font-black text-amber-600">${draftCount}</div>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Collections</div>
          <div class="text-3xl font-black text-purple-600">${collections.length}</div>
        </div>
      </div>

      <!-- Recent Questions & Fast Access -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Questions Table/List -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-gray-900">Recent Questions</h2>
            <button id="pd-btn-view-all" class="text-sm font-bold text-blue-600 hover:underline">
              View All →
            </button>
          </div>

          <div class="divide-y divide-gray-100">
            ${
              recentQuestions.length === 0
                ? `<p class="text-gray-400 text-sm py-4">No questions created yet. Click 'Create Question' to get started!</p>`
                : recentQuestions
                    .map((q) => {
                      const title = q.locales?.en?.title || q.title || 'Untitled';
                      return `
                  <div class="py-3 flex items-center justify-between">
                    <div>
                      <div class="font-bold text-gray-800 text-sm">${title}</div>
                      <div class="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <span class="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold">${q.activityType}</span>
                        <span>${q.domain || 'general'}</span>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 text-xs font-bold rounded-full ${
                      q.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }">
                      ${q.status}
                    </span>
                  </div>
                `;
                    })
                    .join('')
            }
          </div>
        </div>

        <!-- Quick Navigation Sidebar -->
        <div class="space-y-4">
          <div class="bg-blue-50/70 border border-blue-200 rounded-2xl p-5">
            <h3 class="font-bold text-blue-950 mb-1">Question Collections</h3>
            <p class="text-xs text-blue-800 mb-3">Group questions into custom packs for daily practice.</p>
            <button id="pd-btn-collections" class="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 min-h-[40px]">
              Manage Collections
            </button>
          </div>

          <div class="bg-purple-50/70 border border-purple-200 rounded-2xl p-5">
            <h3 class="font-bold text-purple-950 mb-1">Learning Progress</h3>
            <p class="text-xs text-purple-800 mb-3">Review completed activities, skills practiced, and offline tips.</p>
            <button id="pd-btn-progress" class="w-full py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 min-h-[40px]">
              View Progress Report
            </button>
          </div>

          <div class="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5">
            <h3 class="font-bold text-emerald-950 mb-1">Import / Export</h3>
            <p class="text-xs text-emerald-800 mb-3">Backup or transfer your custom family questions safely as JSON.</p>
            <button id="pd-btn-import-export" class="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 min-h-[40px]">
              Import & Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach button triggers
  const createBtn = container.querySelector('#pd-btn-create');
  if (createBtn) onTouch(createBtn, () => navigateTo('/parent/create'));

  const viewAllBtn = container.querySelector('#pd-btn-view-all');
  if (viewAllBtn) onTouch(viewAllBtn, () => navigateTo('/parent/questions'));

  const switchChildBtn = container.querySelector('#pd-btn-switch-child');
  if (switchChildBtn) onTouch(switchChildBtn, () => navigateTo('/play'));

  const collectionsBtn = container.querySelector('#pd-btn-collections');
  if (collectionsBtn) onTouch(collectionsBtn, () => navigateTo('/parent/collections'));

  const progressBtn = container.querySelector('#pd-btn-progress');
  if (progressBtn) onTouch(progressBtn, () => navigateTo('/parent/progress'));

  const importExportBtn = container.querySelector('#pd-btn-import-export');
  if (importExportBtn) onTouch(importExportBtn, () => navigateTo('/parent/import-export'));
}

