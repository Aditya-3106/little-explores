/**
 * @file memory-match.js
 * @description ACT-11: Memory Match activity type.
 * Classic educational card-flip matching game.
 * @module activities/types/memory-match
 */

import { createElement, onTouch } from '../../utils/dom.js';

const MemoryMatch = {
  type: 'memory-match',
  version: 1,
  name: { en: 'Memory Match', mr: 'स्मृती जुळवणी' },
  description: {
    en: 'Find matching cards',
    mr: 'कार्ड्स उलटे करून जुळणाऱ्या जोड्या शोधा',
  },
  icon: '🃏',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    const payload = existingData?.payload || {
      cards: ['🐶', '🐱', '🐰'],
    };

    container.innerHTML = `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Card Items (comma separated emojis/words)</label>
          <input type="text" id="mm-cards" class="w-full mt-1 p-2 border rounded" value="${payload.cards.join(', ')}">
          <p class="text-xs text-gray-500 mt-1">Each item will be duplicated to make a matching pair.</p>
        </div>
      </div>
    `;

    return {
      getData() {
        const cards = container.querySelector('#mm-cards').value.split(',').map((s) => s.trim()).filter(Boolean);
        return { cards };
      },
      validate() {
        return { valid: true, errors: [] };
      },
      destroy() {},
    };
  },

  validate(activity) {
    if (!activity.payload?.cards || activity.payload.cards.length < 2) {
      return { valid: false, errors: ['Memory match requires at least 2 cards'] };
    }
    return { valid: true, errors: [] };
  },

  render(activity, container, options = {}) {
    const baseCards = activity.payload?.cards || ['🐶', '🐱', '🐰'];
    // Duplicate and shuffle
    const deck = [...baseCards, ...baseCards]
      .map((val, idx) => ({ id: idx, value: val, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);

    let flippedIndices = [];
    let matchesFound = 0;
    let submitCb = null;

    container.innerHTML = `
      <div class="memory-container max-w-md mx-auto p-4 flex flex-col items-center gap-6">
        <div id="memory-grid" class="grid grid-cols-3 gap-3 w-full"></div>
      </div>
    `;

    const grid = container.querySelector('#memory-grid');

    function renderCards() {
      grid.innerHTML = '';
      deck.forEach((card, idx) => {
        const btn = createElement('button', {
          className: `h-24 rounded-2xl border-3 flex items-center justify-center text-4xl transition-all shadow-md min-h-[64px] ${
            card.matched
              ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60'
              : card.flipped
              ? 'bg-amber-100 border-amber-400 text-amber-900 rotate-y-180'
              : 'bg-indigo-500 border-indigo-600 text-white font-bold'
          }`,
          innerHTML: card.flipped || card.matched ? card.value : '❓',
        });

        if (!card.matched && !card.flipped) {
          onTouch(btn, () => {
            if (flippedIndices.length >= 2) return;

            card.flipped = true;
            flippedIndices.push(idx);
            renderCards();

            if (flippedIndices.length === 2) {
              const [firstIdx, secondIdx] = flippedIndices;
              const card1 = deck[firstIdx];
              const card2 = deck[secondIdx];

              if (card1.value === card2.value) {
                // Match
                card1.matched = true;
                card2.matched = true;
                flippedIndices = [];
                matchesFound++;
                renderCards();

                if (matchesFound === baseCards.length) {
                  if (submitCb) submitCb({ correct: true });
                }
              } else {
                // No match, flip back after delay
                setTimeout(() => {
                  card1.flipped = false;
                  card2.flipped = false;
                  flippedIndices = [];
                  renderCards();
                }, 800);
              }
            }
          });
        }

        grid.appendChild(btn);
      });
    }

    renderCards();

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
      message: lang === 'mr' ? 'अप्रतिम! सर्व जोड्या शोधल्यात! 🌟' : 'Brilliant memory! You found all matches! 🌟',
    };
  },
};

export default MemoryMatch;

