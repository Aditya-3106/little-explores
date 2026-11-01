/**
 * @file child-profiles.js
 * @description Minimal privacy-preserving child profile management.
 * Collects minimal information (nickname, age group, language) with NO photos, exact birth dates, or location.
 * @module parent/child-profiles
 */

import { createElement, onTouch } from '../utils/dom.js';
import { db } from '../storage/database.js';

export async function renderChildProfiles(container) {
  let profiles = await db.profiles.getAll();

  // If no profiles, create default one
  if (profiles.length === 0) {
    const def = await db.profiles.create({
      id: 'default_child',
      nickname: 'Aarav',
      ageGroup: 'nursery',
      preferredLanguage: 'en',
    });
    profiles = [def];
  }

  function renderView() {
    container.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-6">
        <div class="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200">
          <div>
            <h1 class="text-2xl font-black text-gray-900">Child Profiles</h1>
            <p class="text-xs text-gray-500">Manage household child profiles for personalized activity recommendations.</p>
          </div>
          <button id="btn-add-profile" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm min-h-[44px]">
            ➕ Add Profile
          </button>
        </div>

        <div class="space-y-3" id="profiles-list">
          ${profiles
            .map(
              (p) => `
            <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
                  👶
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-base">${p.nickname}</h3>
                  <div class="text-xs text-gray-400 font-semibold flex gap-2 mt-0.5">
                    <span class="uppercase">${p.ageGroup}</span>
                    <span>•</span>
                    <span>${p.preferredLanguage === 'mr' ? 'Marathi' : 'English'}</span>
                  </div>
                </div>
              </div>
              <button data-pid="${p.id}" class="btn-del-p text-xs text-rose-500 font-bold hover:underline">
                Remove
              </button>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    const addBtn = container.querySelector('#btn-add-profile');
    if (addBtn) {
      onTouch(addBtn, async () => {
        const name = prompt("Enter child's nickname (e.g. Anaya):");
        if (name && name.trim()) {
          await db.profiles.create({
            nickname: name.trim(),
            ageGroup: 'nursery',
            preferredLanguage: 'en',
          });
          profiles = await db.profiles.getAll();
          renderView();
        }
      });
    }

    container.querySelectorAll('.btn-del-p').forEach((btn) => {
      onTouch(btn, async () => {
        const id = btn.dataset.pid;
        if (profiles.length <= 1) {
          alert('At least one child profile must remain.');
          return;
        }
        if (confirm('Remove this child profile?')) {
          await db.profiles.delete(id);
          profiles = await db.profiles.getAll();
          renderView();
        }
      });
    });
  }

  renderView();
}

