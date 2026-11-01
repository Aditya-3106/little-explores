/**
 * @file find-difference.js
 * @description ACT-10: Find the Difference activity type.
 * Two scenes or pictures with subtle differences for visual observation.
 * @module activities/types/find-difference
 */

import { createElement, onTouch } from '../../utils/dom.js';

const FindDifference = {
  type: 'find-difference',
  version: 1,
  name: { en: 'Find the Difference', mr: 'फरक ओळखा' },
  description: {
    en: 'Identify differences between pictures',
    mr: 'दोन चित्रांमधील फरक शोधा',
  },
  icon: '🔍',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    const payload = existingData?.payload || {
      differencesCount: 2,
    };
    container.innerHTML = `<div class="p-3 bg-gray-50 rounded"><p class="text-sm">Configured with spot differences.</p></div>`;
    return {
      getData: () => payload,
      validate: () => ({ valid: true, errors: [] }),
      destroy() {},
    };
  },

  validate(activity) {
    return { valid: true, errors: [] };
  },

  render(activity, container, options = {}) {
    let submitCb = null;
    let found = 0;
    const targetCount = activity.payload?.differencesCount || 2;

    container.innerHTML = `
      <div class="diff-container max-w-xl mx-auto p-4 flex flex-col items-center gap-6">
        <div class="flex items-center gap-4 bg-amber-100 text-amber-900 px-4 py-2 rounded-2xl font-bold">
          <span>Find the differences!</span>
          <span id="diff-counter">Found: 0 / ${targetCount}</span>
        </div>

        <div class="grid grid-cols-2 gap-4 w-full">
          <!-- Picture 1 -->
          <div class="p-4 bg-white rounded-3xl border-2 border-gray-200 flex flex-col items-center gap-2">
            <span class="text-xs font-bold text-gray-400">Picture A</span>
            <div class="text-5xl p-4 bg-sky-50 rounded-2xl">🏡 🌻 🐱 ☀️</div>
          </div>

          <!-- Picture 2 with clickable difference spots -->
          <div class="p-4 bg-white rounded-3xl border-2 border-gray-200 flex flex-col items-center gap-2">
            <span class="text-xs font-bold text-gray-400">Picture B (Tap difference!)</span>
            <div class="text-5xl p-4 bg-sky-50 rounded-2xl flex gap-1">
              <span>🏡</span>
              <button id="diff-spot-1" class="cursor-pointer hover:scale-110 transition-transform">🌹</button>
              <span>🐱</span>
              <button id="diff-spot-2" class="cursor-pointer hover:scale-110 transition-transform">☁️</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const counter = container.querySelector('#diff-counter');

    const handleSpot = (btn) => {
      if (btn.classList.contains('found')) return;
      btn.classList.add('found', 'ring-4', 'ring-emerald-400', 'rounded-xl', 'bg-emerald-100');
      found++;
      counter.textContent = `Found: ${found} / ${targetCount}`;

      if (found >= targetCount && submitCb) {
        submitCb({ correct: true, found });
      }
    };

    const s1 = container.querySelector('#diff-spot-1');
    const s2 = container.querySelector('#diff-spot-2');
    if (s1) onTouch(s1, () => handleSpot(s1));
    if (s2) onTouch(s2, () => handleSpot(s2));

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
      correct: response.correct === true,
      score: response.correct ? 1 : 0,
      details: response,
    };
  },

  getFeedback(activity, response, lang = 'en') {
    return {
      type: 'success',
      message: lang === 'mr' ? 'शाब्बास! सर्व फरक शोधलेत! 🌟' : 'Eagle eye! You spotted all differences! 🌟',
    };
  },
};

export default FindDifference;

