/**
 * @file patterns.js
 * @description ACT-07: Complete the Pattern activity type.
 * Displays a repeating pattern sequence with one element missing.
 * Child selects which option completes the pattern (e.g. 🔴 🔵 🔴 🔵 ❓).
 * @module activities/types/patterns
 */

import { createElement, onTouch } from '../../utils/dom.js';

const Patterns = {
  type: 'patterns',
  version: 1,
  name: { en: 'Complete the Pattern', mr: 'नमुना पूर्ण करा' },
  description: {
    en: 'Identify the missing pattern element',
    mr: 'नमुन्यातील गहाळ वस्तू ओळखा आणि पूर्ण करा',
  },
  icon: '🔲',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    const payload = existingData?.payload || {
      sequence: ['🔴', '🔵', '🔴', '🔵', '?'],
      options: ['🔴', '🔵', '🟢'],
      correctIndex: 0,
    };

    container.innerHTML = `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Pattern Sequence (comma separated emojis/symbols)</label>
          <input type="text" id="pat-seq" class="w-full mt-1 p-2 border rounded" value="${payload.sequence.join(', ')}">
          <p class="text-xs text-gray-500 mt-1">Include '?' for the missing spot</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Answer Options (comma separated)</label>
          <input type="text" id="pat-opts" class="w-full mt-1 p-2 border rounded" value="${payload.options.join(', ')}">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Correct Option Index (0 for first, 1 for second...)</label>
          <input type="number" id="pat-correct" class="w-full mt-1 p-2 border rounded" value="${payload.correctIndex}" min="0">
        </div>
      </div>
    `;

    return {
      getData() {
        const seq = container.querySelector('#pat-seq').value.split(',').map((s) => s.trim());
        const opts = container.querySelector('#pat-opts').value.split(',').map((s) => s.trim());
        const corr = parseInt(container.querySelector('#pat-correct').value, 10) || 0;
        return { sequence: seq, options: opts, correctIndex: corr };
      },
      validate() {
        return { valid: true, errors: [] };
      },
      destroy() {},
    };
  },

  validate(activity) {
    if (!activity.payload?.sequence || !activity.payload?.options) {
      return { valid: false, errors: ['Pattern sequence and options are required.'] };
    }
    return { valid: true, errors: [] };
  },

  render(activity, container, options = {}) {
    const seq = activity.payload?.sequence || ['🟡', '🟢', '🟡', '🟢', '?'];
    const opts = activity.payload?.options || ['🟡', '🟢'];
    const correctIdx = activity.payload?.correctIndex ?? 0;
    const correctValue = opts[correctIdx];

    let submitCb = null;

    container.innerHTML = `
      <div class="patterns-container max-w-lg mx-auto p-4 flex flex-col items-center gap-6">
        <!-- Sequence Display -->
        <div class="flex items-center justify-center flex-wrap gap-3 p-6 bg-amber-50/70 border-2 border-amber-200 rounded-3xl w-full shadow-sm">
          ${seq
            .map(
              (item) => `
            <div class="pattern-item w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold ${
              item === '?'
                ? 'bg-amber-200 border-3 border-dashed border-amber-400 text-amber-800 animate-pulse'
                : 'bg-white shadow-sm border border-gray-100'
            }">
              ${item}
            </div>
          `
            )
            .join('')}
        </div>

        <p class="text-gray-600 font-semibold text-center">What comes next in the pattern?</p>

        <!-- Options to Choose -->
        <div class="flex items-center justify-center gap-4 flex-wrap w-full">
          ${opts
            .map(
              (opt, idx) => `
            <button data-opt-idx="${idx}" class="pat-choice w-20 h-20 text-4xl bg-white border-3 border-indigo-200 hover:border-indigo-400 rounded-3xl shadow-md flex items-center justify-center transition-all active:scale-95 min-h-[64px] min-w-[64px]">
              ${opt}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    const choiceBtns = container.querySelectorAll('.pat-choice');
    choiceBtns.forEach((btn) => {
      onTouch(btn, () => {
        const chosenIdx = parseInt(btn.dataset.optIdx, 10);
        const isCorrect = chosenIdx === correctIdx;

        if (isCorrect) {
          btn.classList.add('border-emerald-500', 'bg-emerald-50', 'scale-105');
          const missingSpot = container.querySelector('.pattern-item:nth-child(' + (seq.indexOf('?') + 1) + ')');
          if (missingSpot) {
            missingSpot.textContent = correctValue;
            missingSpot.classList.remove('animate-pulse', 'border-dashed');
            missingSpot.classList.add('bg-emerald-100', 'border-emerald-400');
          }
          if (submitCb) submitCb({ correct: true, choice: opts[chosenIdx] });
        } else {
          btn.classList.add('border-rose-400', 'bg-rose-50');
          setTimeout(() => {
            btn.classList.remove('border-rose-400', 'bg-rose-50');
          }, 400);
          if (submitCb) submitCb({ correct: false, choice: opts[chosenIdx] });
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
    if (response.correct) {
      return {
        type: 'success',
        message: lang === 'mr' ? 'शाब्बास! नमुना बरोबर ओळखला! 🌟' : 'Super! You completed the pattern! 🌟',
      };
    }
    return {
      type: 'encouragement',
      message: lang === 'mr' ? 'नमुन्यातील सुरुवातीचे आकार पहा आणि पुन्हा प्रयत्न करा! 😊' : 'Look at the pattern from the start and try again! 😊',
    };
  },
};

export default Patterns;

