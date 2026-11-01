/**
 * @file collections.js
 * @description Question Collections management for organizing themed packs.
 * @module parent/collections
 */

import { createElement, onTouch } from '../utils/dom.js';
import { db } from '../storage/database.js';

export async function renderCollections(container) {
  let collections = await db.collections.getAll();

  function renderView() {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200">
          <div>
            <h1 class="text-2xl font-black text-gray-900">Question Collections</h1>
            <p class="text-xs text-gray-500">Group activities into themed packs (e.g. Daily Math, Weekend Puzzles).</p>
          </div>
          <button id="btn-new-coll" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm min-h-[44px]">
            ➕ New Collection
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="coll-grid">
          ${
            collections.length === 0
              ? `<div class="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed">
                  No collections created yet.
                </div>`
              : collections
                  .map(
                    (c) => `
                <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span class="text-3xl mb-2 block">${c.icon || '📁'}</span>
                    <h3 class="font-bold text-gray-900 text-base mb-1">${c.name}</h3>
                    <p class="text-xs text-gray-500 mb-3">${c.description || 'Custom pack'}</p>
                    <span class="text-xs font-semibold px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                      ${c.activityIds?.length || 0} activities
                    </span>
                  </div>
                  <div class="pt-4 mt-4 border-t border-gray-100 flex justify-end">
                    <button data-coll-id="${c.id}" class="btn-del-coll text-xs text-rose-500 font-bold hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              `
                  )
                  .join('')
          }
        </div>
      </div>
    `;

    const newBtn = container.querySelector('#btn-new-coll');
    if (newBtn) {
      onTouch(newBtn, async () => {
        const name = prompt('Enter collection name (e.g. Daily Mathematics):');
        if (name && name.trim()) {
          await db.collections.create({
            name: name.trim(),
            description: 'Custom learning collection',
            icon: '📁',
          });
          collections = await db.collections.getAll();
          renderView();
        }
      });
    }

    container.querySelectorAll('.btn-del-coll').forEach((btn) => {
      onTouch(btn, async () => {
        const id = btn.dataset.collId;
        if (confirm('Delete this collection? (Questions will not be deleted)')) {
          await db.collections.delete(id);
          collections = await db.collections.getAll();
          renderView();
        }
      });
    });
  }

  renderView();
}

