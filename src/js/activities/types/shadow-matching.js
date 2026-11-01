/**
 * @file shadow-matching.js
 * @description ACT-12: Shadow Matching activity type.
 * Match colored objects with their silhouette or shadow.
 * @module activities/types/shadow-matching
 */

import { createElement, onTouch } from '../../utils/dom.js';

const ShadowMatching = {
  type: 'shadow-matching',
  version: 1,
  name: { en: 'Shadow Matching', mr: 'सावली जुळवा' },
  description: {
    en: 'Match objects with their shadows',
    mr: 'वस्तूंना त्यांच्या योग्य सावलीशी जुळवा',
  },
  icon: '👤',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    const payload = existingData?.payload || {
      pairs: [
        { id: 'p1', object: '🦋', shadow: '⬛', label: 'Butterfly' },
        { id: 'p2', object: '🌟', shadow: '⬛', label: 'Star' },
      ],
    };
    container.innerHTML = `<div class="p-3 bg-gray-50 rounded"><p class="text-sm">Configured with object-shadow pairs.</p></div>`;
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
    const pairs = activity.payload?.pairs || [
      { id: 'p1', object: '🦁', label: 'Lion' },
      { id: 'p2', object: '🐘', label: 'Elephant' },
      { id: 'p3', object: '🦒', label: 'Giraffe' },
    ];

    let selectedLeftId = null;
    let matchesCount = 0;
    let submitCb = null;

    const leftItems = pairs.map((p) => ({ ...p, matched: false }));
    const rightShadows = [...pairs]
      .sort(() => Math.random() - 0.5)
      .map((p) => ({ ...p, matched: false }));

    container.innerHTML = `
      <div class="shadow-container max-w-xl mx-auto p-4 flex justify-between gap-6">
        <div id="shadow-left" class="flex flex-col gap-4 w-1/2"></div>
        <div id="shadow-right" class="flex flex-col gap-4 w-1/2"></div>
      </div>
    `;

    const leftCol = container.querySelector('#shadow-left');
    const rightCol = container.querySelector('#shadow-right');

    function renderColumns() {
      leftCol.innerHTML = '';
      rightCol.innerHTML = '';

      leftItems.forEach((item) => {
        const btn = createElement('button', {
          className: `w-full p-4 rounded-2xl flex flex-col items-center justify-center border-3 transition-all min-h-[64px] ${
            item.matched
              ? 'bg-emerald-100 border-emerald-400 opacity-60'
              : selectedLeftId === item.id
              ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-200 scale-102'
              : 'bg-white border-amber-200 shadow-md'
          }`,
          innerHTML: `<span class="text-4xl">${item.object}</span><span class="text-xs font-bold text-gray-600 mt-1">${item.label || ''}</span>`,
        });

        if (!item.matched) {
          onTouch(btn, () => {
            selectedLeftId = item.id;
            renderColumns();
          });
        }
        leftCol.appendChild(btn);
      });

      rightShadows.forEach((shadow) => {
        const btn = createElement('button', {
          className: `w-full p-4 rounded-2xl flex flex-col items-center justify-center border-3 transition-all min-h-[64px] ${
            shadow.matched
              ? 'bg-emerald-100 border-emerald-400 opacity-60'
              : 'bg-gray-800 border-gray-900 text-white shadow-md'
          }`,
          innerHTML: `<span class="text-4xl filter grayscale contrast-200 brightness-0 opacity-80">${shadow.object}</span><span class="text-xs font-bold text-gray-300 mt-1">Shadow</span>`,
        });

        if (!shadow.matched) {
          onTouch(btn, () => {
            if (!selectedLeftId) return;

            if (selectedLeftId === shadow.id) {
              const leftObj = leftItems.find((l) => l.id === selectedLeftId);
              leftObj.matched = true;
              shadow.matched = true;
              selectedLeftId = null;
              matchesCount++;
              renderColumns();

              if (matchesCount === pairs.length && submitCb) {
                submitCb({ correct: true });
              }
            } else {
              btn.classList.add('border-rose-500');
              setTimeout(() => btn.classList.remove('border-rose-500'), 400);
              if (submitCb) submitCb({ correct: false });
            }
          });
        }
        rightCol.appendChild(btn);
      });
    }

    renderColumns();

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
      type: response.correct ? 'success' : 'encouragement',
      message: response.correct
        ? (lang === 'mr' ? 'छान! सर्व सावल्या बरोबर ओळखल्यात! 🌟' : 'Super! All shadows matched! 🌟')
        : (lang === 'mr' ? 'आकार काळजीपूर्वक पहा आणि पुन्हा सावली जुळवा! 😊' : 'Look at the shape outlines carefully! 😊'),
    };
  },
};

export default ShadowMatching;

