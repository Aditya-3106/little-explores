/**
 * @file missing-piece.js
 * @description ACT-13: Missing Piece Puzzle activity type.
 * Identify which missing piece completes the picture or illustration.
 * @module activities/types/missing-piece
 */

import { createElement, onTouch } from '../../utils/dom.js';

const MissingPiece = {
  type: 'missing-piece',
  version: 1,
  name: { en: 'Missing Piece Puzzle', mr: 'गहाळ तुकडा कोडे' },
  description: {
    en: 'Complete an illustration by choosing the missing piece',
    mr: 'चित्राचा गहाळ तुकडा निवडून चित्र पूर्ण करा',
  },
  icon: '🧩',
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

    container.innerHTML = `
      <div class="missing-piece-container max-w-lg mx-auto p-4 flex flex-col items-center gap-6">
        <!-- Main picture with a missing spot -->
        <div class="relative bg-white p-6 rounded-3xl border-3 border-purple-200 shadow-md flex items-center justify-center">
          <div class="text-6xl flex items-center gap-2">
            <span>🦁</span>
            <div id="missing-slot" class="w-16 h-16 border-3 border-dashed border-amber-400 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl font-black text-amber-500 animate-pulse">
              ?
            </div>
            <span>🐾</span>
          </div>
        </div>

        <p class="text-gray-600 font-semibold text-center">Which piece fits into the empty spot?</p>

        <!-- Choices -->
        <div class="flex items-center gap-4">
          <button data-correct="false" class="mp-choice p-4 text-4xl bg-white border-2 border-gray-200 hover:border-purple-400 rounded-2xl shadow-sm min-h-[64px] min-w-[64px]">
            🚗
          </button>
          <button data-correct="true" class="mp-choice p-4 text-4xl bg-white border-2 border-gray-200 hover:border-purple-400 rounded-2xl shadow-sm min-h-[64px] min-w-[64px]">
            👑
          </button>
          <button data-correct="false" class="mp-choice p-4 text-4xl bg-white border-2 border-gray-200 hover:border-purple-400 rounded-2xl shadow-sm min-h-[64px] min-w-[64px]">
            ⚽
          </button>
        </div>
      </div>
    `;

    const slot = container.querySelector('#missing-slot');
    const buttons = container.querySelectorAll('.mp-choice');

    buttons.forEach((btn) => {
      onTouch(btn, () => {
        const isCorrect = btn.dataset.correct === 'true';
        if (isCorrect) {
          slot.textContent = btn.textContent.trim();
          slot.classList.remove('border-dashed', 'animate-pulse');
          slot.classList.add('bg-emerald-100', 'border-emerald-400');
          btn.classList.add('border-emerald-500', 'bg-emerald-50');
          if (submitCb) submitCb({ correct: true });
        } else {
          btn.classList.add('border-rose-400');
          setTimeout(() => btn.classList.remove('border-rose-400'), 400);
          if (submitCb) submitCb({ correct: false });
        }
      });
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
      correct: response.correct === true,
      score: response.correct ? 1 : 0,
      details: response,
    };
  },

  getFeedback(activity, response, lang = 'en') {
    return {
      type: response.correct ? 'success' : 'encouragement',
      message: response.correct
        ? (lang === 'mr' ? 'छान! चित्र पूर्ण झाले! 🌟' : 'Perfect fit! Picture is complete! 🌟')
        : (lang === 'mr' ? 'चित्राशी काय जुळते ते विचार करा! 😊' : 'Think what belongs in this picture! 😊'),
    };
  },
};

export default MissingPiece;

