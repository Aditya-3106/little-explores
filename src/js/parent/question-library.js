/**
 * @file question-library.js
 * @description Question Library management view with filtering, search, duplicate, delete, and edit.
 * @module parent/question-library
 */

import { createElement, onTouch } from '../utils/dom.js';
import { db } from '../storage/database.js';
import { navigateTo } from '../core/router.js';

export async function renderQuestionLibrary(container) {
  let allActivities = await db.questions.getAll();
  let filterDomain = 'all';
  let filterStatus = 'all';
  let searchQuery = '';

  function renderView() {
    const filtered = allActivities.filter((act) => {
      if (filterDomain !== 'all' && act.domain !== filterDomain) return false;
      if (filterStatus !== 'all' && act.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const title = (act.locales?.en?.title || act.title || '').toLowerCase();
        const desc = (act.locales?.en?.instruction || '').toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }
      return true;
    });

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top Toolbar -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div>
            <h1 class="text-2xl font-black text-gray-900">Question Library</h1>
            <p class="text-xs text-gray-500">Manage, edit, duplicate, and filter your question library.</p>
          </div>
          <button id="ql-create-btn" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-xs flex items-center gap-2 min-h-[44px]">
            <span>➕ New Question</span>
          </button>
        </div>

        <!-- Filter & Search Bar -->
        <div class="bg-white p-4 rounded-2xl border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
          <input type="text" id="ql-search" placeholder="Search by title..." value="${searchQuery}" class="p-2.5 border rounded-xl text-sm w-full sm:w-64">

          <div class="flex gap-3">
            <select id="ql-filter-status" class="p-2 border rounded-xl text-sm font-medium">
              <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="published" ${filterStatus === 'published' ? 'selected' : ''}>Published</option>
              <option value="draft" ${filterStatus === 'draft' ? 'selected' : ''}>Drafts</option>
            </select>
          </div>
        </div>

        <!-- Questions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="ql-grid">
          ${
            filtered.length === 0
              ? `<div class="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed">
                  No questions match your filter.
                </div>`
              : filtered
                  .map((act) => {
                    const title = act.locales?.en?.title || act.title || 'Untitled';
                    const instruction = act.locales?.en?.instruction || '';
                    return `
                <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between gap-4">
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        act.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }">
                        ${act.status}
                      </span>
                      <span class="text-xs font-semibold text-gray-400 uppercase">${act.activityType}</span>
                    </div>
                    <h3 class="text-base font-bold text-gray-900 mb-1">${title}</h3>
                    <p class="text-xs text-gray-500 line-clamp-2">${instruction}</p>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                    <button data-act-id="${act.id}" class="btn-play text-blue-600 font-bold hover:underline">
                      Play ▶
                    </button>
                    <div class="flex gap-2">
                      <button data-act-id="${act.id}" class="btn-edit text-indigo-600 hover:text-indigo-800 font-semibold">
                        Edit ✏️
                      </button>
                      <button data-act-id="${act.id}" class="btn-dup text-gray-500 hover:text-gray-800 font-semibold">
                        Duplicate
                      </button>
                      <button data-act-id="${act.id}" class="btn-del text-rose-500 hover:text-rose-700 font-semibold">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              `;
                  })
                  .join('')
          }
        </div>
      </div>
    `;

    // Hook listeners
    const createBtn = container.querySelector('#ql-create-btn');
    if (createBtn) onTouch(createBtn, () => navigateTo('/parent/create'));

    const searchInput = container.querySelector('#ql-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderView();
      });
    }

    const statusSel = container.querySelector('#ql-filter-status');
    if (statusSel) {
      statusSel.addEventListener('change', (e) => {
        filterStatus = e.target.value;
        renderView();
      });
    }

    // Play action
    container.querySelectorAll('.btn-play').forEach((btn) => {
      onTouch(btn, () => {
        const id = btn.dataset.actId;
        navigateTo(`/play/activity/${id}`);
      });
    });

    // Edit action
    container.querySelectorAll('.btn-edit').forEach((btn) => {
      onTouch(btn, () => {
        const id = btn.dataset.actId;
        navigateTo(`/parent/edit/${id}`);
      });
    });

    // Duplicate action
    container.querySelectorAll('.btn-dup').forEach((btn) => {
      onTouch(btn, async () => {
        const id = btn.dataset.actId;
        const orig = await db.questions.getById(id);
        if (orig) {
          const dup = {
            ...orig,
            id: 'act_' + Date.now(),
            title: (orig.title || 'Activity') + ' (Copy)',
            createdAt: new Date().toISOString(),
          };
          if (dup.locales?.en) dup.locales.en.title = dup.title;
          await db.questions.create(dup);
          allActivities = await db.questions.getAll();
          renderView();
        }
      });
    });

    // Delete action
    container.querySelectorAll('.btn-del').forEach((btn) => {
      onTouch(btn, async () => {
        const id = btn.dataset.actId;
        if (confirm('Delete this question permanently?')) {
          await db.questions.delete(id);
          allActivities = await db.questions.getAll();
          renderView();
        }
      });
    });
  }

  renderView();
}

