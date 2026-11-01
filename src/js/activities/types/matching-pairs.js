/**
 * @file matching-pairs.js
 * @description ACT-04: Matching Pairs interactive activity.
 * Children connect related pairs (e.g. animal to baby, number to dots, letter to picture).
 * Supports tap-to-select left then right with visual connecting feedback.
 * @module activities/types/matching-pairs
 */

import { createElement, onTouch } from '../../utils/dom.js';

const MatchingPairs = {
  type: 'matching-pairs',
  version: 1,
  name: { en: 'Matching Pairs', mr: 'जोड्या जुळवा' },
  description: {
    en: 'Connect related pictures or objects',
    mr: 'संबंधित चित्रे किंवा वस्तू एकमेकांशी जोडा',
  },
  icon: '🔗',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    const pairs = existingData?.payload?.pairs || [
      { id: 'p1', left: '🍎', leftText: 'Apple', right: '🔴', rightText: 'Red' },
      { id: 'p2', left: '🍌', leftText: 'Banana', right: '🟡', rightText: 'Yellow' },
    ];

    container.innerHTML = `
      <div class="space-y-4">
        <label class="block font-medium text-gray-700">Pairs (Left to Right)</label>
        <div id="mp-pairs-container" class="space-y-3">
          ${pairs
            .map(
              (p, i) => `
            <div class="pair-row flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
              <input type="text" class="p-left w-1/4 p-2 border rounded" placeholder="Left Item/Emoji" value="${p.left || ''}">
              <input type="text" class="p-leftText w-1/4 p-2 border rounded" placeholder="Left Label" value="${p.leftText || ''}">
              <span class="text-gray-400">↔</span>
              <input type="text" class="p-right w-1/4 p-2 border rounded" placeholder="Right Item/Emoji" value="${p.right || ''}">
              <input type="text" class="p-rightText w-1/4 p-2 border rounded" placeholder="Right Label" value="${p.rightText || ''}">
              <button type="button" class="remove-pair text-red-500 font-bold px-2">×</button>
            </div>
          `
            )
            .join('')}
        </div>
        <button type="button" id="mp-add-pair" class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200">
          + Add Pair
        </button>
      </div>
    `;

    const pairsList = container.querySelector('#mp-pairs-container');
    container.querySelector('#mp-add-pair').addEventListener('click', () => {
      const row = document.createElement('div');
      row.className = 'pair-row flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200';
      row.innerHTML = `
        <input type="text" class="p-left w-1/4 p-2 border rounded" placeholder="Left Item">
        <input type="text" class="p-leftText w-1/4 p-2 border rounded" placeholder="Left Label">
        <span class="text-gray-400">↔</span>
        <input type="text" class="p-right w-1/4 p-2 border rounded" placeholder="Right Item">
        <input type="text" class="p-rightText w-1/4 p-2 border rounded" placeholder="Right Label">
        <button type="button" class="remove-pair text-red-500 font-bold px-2">×</button>
      `;
      row.querySelector('.remove-pair').addEventListener('click', () => row.remove());
      pairsList.appendChild(row);
    });

    pairsList.querySelectorAll('.remove-pair').forEach((btn) => {
      btn.addEventListener('click', (e) => e.target.closest('.pair-row').remove());
    });

    return {
      getData() {
        const rows = pairsList.querySelectorAll('.pair-row');
        const resultPairs = [];
        rows.forEach((r, idx) => {
          resultPairs.push({
            id: 'pair_' + idx,
            left: r.querySelector('.p-left').value.trim(),
            leftText: r.querySelector('.p-leftText').value.trim(),
            right: r.querySelector('.p-right').value.trim(),
            rightText: r.querySelector('.p-rightText').value.trim(),
          });
        });
        return { pairs: resultPairs };
      },
      validate() {
        const rows = pairsList.querySelectorAll('.pair-row');
        if (rows.length < 2) {
          return { valid: false, errors: ['Please provide at least 2 pairs to match.'] };
        }
        return { valid: true, errors: [] };
      },
      destroy() {},
    };
  },

  validate(activity) {
    const pairs = activity.payload?.pairs;
    if (!pairs || !Array.isArray(pairs) || pairs.length < 2) {
      return { valid: false, errors: ['Matching pairs requires at least 2 pairs in payload.'] };
    }
    return { valid: true, errors: [] };
  },

  render(activity, container, options = {}) {
    const pairs = activity.payload?.pairs || [];
    let submitCb = null;
    let hintCb = null;

    // Shuffle right items to make matching engaging
    const leftItems = pairs.map((p) => ({ ...p, matched: false }));
    const rightItems = [...pairs]
      .sort(() => Math.random() - 0.5)
      .map((p) => ({ ...p, matched: false }));

    let selectedLeftId = null;
    let matchedCount = 0;

    container.innerHTML = `
      <div class="matching-container max-w-xl mx-auto p-4 flex justify-between gap-6">
        <div id="left-column" class="flex flex-col gap-4 w-1/2"></div>
        <div id="right-column" class="flex flex-col gap-4 w-1/2"></div>
      </div>
    `;

    const leftCol = container.querySelector('#left-column');
    const rightCol = container.querySelector('#right-column');

    function renderItems() {
      leftCol.innerHTML = '';
      rightCol.innerHTML = '';

      leftItems.forEach((item) => {
        const btn = createElement('button', {
          className: `w-full p-4 rounded-2xl flex flex-col items-center justify-center border-3 transition-all min-h-[64px] ${
            item.matched
              ? 'bg-emerald-100 border-emerald-400 opacity-60 cursor-default'
              : selectedLeftId === item.id
              ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-200 scale-102'
              : 'bg-white border-purple-200 shadow-md hover:border-purple-400'
          }`,
        });
        btn.innerHTML = `<span class="text-3xl">${item.left}</span><span class="text-sm font-bold text-gray-700 mt-1">${item.leftText || ''}</span>`;

        if (!item.matched) {
          onTouch(btn, () => {
            selectedLeftId = item.id;
            renderItems();
          });
        }
        leftCol.appendChild(btn);
      });

      rightItems.forEach((item) => {
        const btn = createElement('button', {
          className: `w-full p-4 rounded-2xl flex flex-col items-center justify-center border-3 transition-all min-h-[64px] ${
            item.matched
              ? 'bg-emerald-100 border-emerald-400 opacity-60 cursor-default'
              : 'bg-white border-blue-200 shadow-md hover:border-blue-400'
          }`,
        });
        btn.innerHTML = `<span class="text-3xl">${item.right}</span><span class="text-sm font-bold text-gray-700 mt-1">${item.rightText || ''}</span>`;

        if (!item.matched) {
          onTouch(btn, () => {
            if (!selectedLeftId) return;

            if (selectedLeftId === item.id) {
              // Correct pair match!
              const leftObj = leftItems.find((l) => l.id === selectedLeftId);
              leftObj.matched = true;
              item.matched = true;
              selectedLeftId = null;
              matchedCount++;
              renderItems();

              if (matchedCount === pairs.length && submitCb) {
                submitCb({ correct: true, pairsMatched: matchedCount });
              }
            } else {
              // Incorrect attempt
              btn.classList.add('border-rose-400', 'bg-rose-50');
              setTimeout(() => {
                btn.classList.remove('border-rose-400', 'bg-rose-50');
              }, 400);
              if (submitCb) {
                submitCb({ correct: false, selected: [selectedLeftId, item.id] });
              }
            }
          });
        }
        rightCol.appendChild(btn);
      });
    }

    renderItems();

    return {
      onSubmit(cb) {
        submitCb = cb;
      },
      onHint(cb) {
        hintCb = cb;
      },
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
    if (response.correct) {
      return {
        type: 'success',
        message: lang === 'mr' ? 'छान! सर्व जोड्या बरोबर जुळवल्यात! 🌟' : 'Awesome! All pairs matched! 🌟',
      };
    }
    return {
      type: 'encouragement',
      message: lang === 'mr' ? 'पुन्हा प्रयत्न करा, तुम्ही करू शकता! 😊' : "Let's try matching again! 😊",
    };
  },
};

export default MatchingPairs;

