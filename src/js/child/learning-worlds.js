/**
 * @file learning-worlds.js
 * @description Detail view for an individual learning world, listing available activities.
 * @module child/learning-worlds
 */

import { createElement, onTouch } from '../utils/dom.js';
import { LEARNING_WORLDS } from '../core/config.js';
import { db } from '../storage/database.js';
import { navigateTo } from '../core/router.js';
import { getMiloSVG } from './milo-mascot.js';

export async function renderWorldDetail(worldId, container) {
  const currentLang = window.currentLang || 'en';
  const world = LEARNING_WORLDS.find((w) => w.id === worldId) || LEARNING_WORLDS[0];

  const worldName = world.name?.[currentLang] || world.name?.en || world.id;
  const greeting = world.greeting?.[currentLang] || world.greeting?.en || 'Let us explore!';

  // Fetch activities matching this world
  const allActivities = await db.questions.getAll();
  // Filter activities matching world ID or world domains
  const activities = allActivities.filter((a) => {
    if (a.worldId === worldId) return true;
    if (a.domain && (world.domains?.includes(a.domain) || a.domain === world.id)) return true;
    return false;
  });

  container.innerHTML = `
    <div class="world-detail max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-6">
      <!-- Back button & World Header -->
      <div class="flex items-center gap-4">
        <button id="btn-world-back" class="p-3 bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 flex items-center justify-center text-xl font-bold min-h-[48px] min-w-[48px]">
          ←
        </button>
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm" style="background-color: ${world.color}20;">
            ${world.icon}
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-black text-gray-900">${worldName}</h1>
            <p class="text-xs md:text-sm text-gray-500 font-semibold">${greeting}</p>
          </div>
        </div>
      </div>

      <!-- Milo speech -->
      <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center gap-4">
        <div class="flex-shrink-0">
          ${getMiloSVG('point', 70)}
        </div>
        <p class="text-amber-950 font-bold text-sm md:text-base">
          ${currentLang === 'mr' ? 'खेळायला एक कार्ड निवडा!' : 'Choose an activity card below to start playing!'}
        </p>
      </div>

      <!-- Activities List -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="world-activities-grid">
        ${
          activities.length === 0
            ? `<div class="col-span-full p-8 text-center bg-white rounded-3xl border-2 border-dashed border-gray-300">
                <span class="text-4xl">🌟</span>
                <p class="text-gray-500 font-bold mt-2">New activities coming soon!</p>
              </div>`
            : activities
                .map((act) => {
                  const title = act.locales?.[currentLang]?.title || act.title || 'Fun Activity';
                  const typeIcon = act.icon || '⭐';
                  return `
                    <button data-act-id="${act.id}" class="act-card p-5 bg-white border-3 border-purple-100 hover:border-purple-400 rounded-3xl shadow-md flex flex-col items-center text-center transition-all hover:scale-102 active:scale-95 cursor-pointer min-h-[140px]">
                      <div class="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-3xl mb-2">
                        ${typeIcon}
                      </div>
                      <h4 class="font-black text-gray-800 text-base mb-1">${title}</h4>
                      <span class="text-xs px-2.5 py-1 bg-purple-100 text-purple-700 font-bold rounded-full">${act.activityType}</span>
                    </button>
                  `;
                })
                .join('')
        }
      </div>
    </div>
  `;

  const backBtn = container.querySelector('#btn-world-back');
  if (backBtn) {
    onTouch(backBtn, () => navigateTo('/play'));
  }

  container.querySelectorAll('.act-card').forEach((card) => {
    onTouch(card, () => {
      const actId = card.dataset.actId;
      navigateTo(`/play/activity/${actId}`);
    });
  });
}

