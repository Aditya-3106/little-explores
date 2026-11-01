/**
 * @file explore-discover.js
 * @description ACT-18: Explore and Discover activity type.
 * Open-ended exploration scene with interactive hotspot discoveries.
 * @module activities/types/explore-discover
 */

import { createElement, onTouch } from '../../utils/dom.js';

const ExploreDiscover = {
  type: 'explore-discover',
  version: 1,
  name: { en: 'Explore and Discover', mr: 'शोधा आणि निरीक्षण करा' },
  description: {
    en: 'Open-ended observation and exploration',
    mr: 'चित्रातील गोष्टी एक्सप्लोर करा आणि शोधा',
  },
  icon: '🧭',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    return {
      getData: () => existingData?.payload || {},
      validate: () => ({ valid: true, errors: [] }),
      destroy() {},
    };
  },

  validate(activity) {
    return { valid: true, errors: [] };
  },

  render(activity, container, options = {}) {
    let submitCb = null;
    let discoveredCount = 0;
    const hotspots = [
      { id: 'h1', icon: '🌳', discovery: 'You found a big mango tree with sweet fruit!' },
      { id: 'h2', icon: '🐇', discovery: 'A little bunny hopping around the grass!' },
      { id: 'h3', icon: '🌈', discovery: 'A colorful rainbow shining in the sky!' },
    ];

    container.innerHTML = `
      <div class="explore-container max-w-lg mx-auto p-4 flex flex-col items-center gap-6">
        <p class="text-gray-600 font-semibold text-center">Tap things in the scene to explore and discover secrets!</p>

        <!-- Discovery Scene -->
        <div class="w-full bg-gradient-to-b from-sky-100 to-emerald-100 rounded-3xl p-6 border-3 border-emerald-300 shadow-md flex justify-around items-center min-h-[180px]">
          ${hotspots
            .map(
              (h) => `
            <button data-hid="${h.id}" class="hotspot-btn text-6xl hover:scale-125 transition-transform p-3 rounded-2xl cursor-pointer active:scale-95">
              ${h.icon}
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Discovery speech bubble -->
        <div id="explore-info" class="w-full bg-white p-4 rounded-2xl border-2 border-indigo-200 shadow-sm text-center font-bold text-indigo-900 min-h-[56px] flex items-center justify-center">
          Tap an object above to learn more!
        </div>

        <button id="explore-done" class="px-6 py-2 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 min-h-[48px]">
          Finished Exploring! 🌟
        </button>
      </div>
    `;

    const infoBox = container.querySelector('#explore-info');
    const buttons = container.querySelectorAll('.hotspot-btn');

    buttons.forEach((btn) => {
      onTouch(btn, () => {
        const hid = btn.dataset.hid;
        const spot = hotspots.find((h) => h.id === hid);
        if (spot) {
          infoBox.textContent = spot.discovery;
          btn.classList.add('ring-4', 'ring-amber-400');
          discoveredCount++;
        }
      });
    });

    container.querySelector('#explore-done').addEventListener('click', () => {
      if (submitCb) submitCb({ correct: true, discoveredCount });
    });

    return {
      onSubmit(cb) {
        submitCb = cb;
      },
      onHint(cb) {},
      destroy() {
        container.innerHTML = '';
      },
    };
  },

  evaluate(activity, response) {
    return {
      correct: true,
      score: 1,
      details: response,
    };
  },

  getFeedback(activity, response, lang = 'en') {
    return {
      type: 'success',
      message: lang === 'mr' ? 'छान निरीक्षण केले! खूप गोष्टी शिकलात! 🌟' : 'Great explorer! You discovered so many things! 🌟',
    };
  },
};

export default ExploreDiscover;

