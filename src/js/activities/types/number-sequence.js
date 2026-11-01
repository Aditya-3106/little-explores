/**
 * @file number-sequence.js
 * @description ACT-08: Number Sequence activity type.
 * Children arrange shuffled numbers in order by tapping them sequentially.
 * @module activities/types/number-sequence
 */

import { createElement, onTouch } from '../../utils/dom.js';

const NumberSequence = {
  type: 'number-sequence',
  version: 1,
  name: { en: 'Number Sequence', mr: 'संख्या क्रम' },
  description: {
    en: 'Arrange numbers in order',
    mr: 'संख्या योग्य क्रमाने लावा',
  },
  icon: '🔢',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    const payload = existingData?.payload || {
      numbers: [1, 2, 3, 4, 5],
    };

    container.innerHTML = `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Correct Sequence (comma-separated numbers)</label>
          <input type="text" id="ns-nums" class="w-full mt-1 p-2 border rounded" value="${payload.numbers.join(', ')}">
        </div>
      </div>
    `;

    return {
      getData() {
        const nums = container.querySelector('#ns-nums').value.split(',').map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n));
        return { numbers: nums };
      },
      validate() {
        return { valid: true, errors: [] };
      },
      destroy() {},
    };
  },

  validate(activity) {
    if (!activity.payload?.numbers || !Array.isArray(activity.payload.numbers)) {
      return { valid: false, errors: ['Number sequence requires numbers array'] };
    }
    return { valid: true, errors: [] };
  },

  render(activity, container, options = {}) {
    const correctSeq = activity.payload?.numbers || [1, 2, 3, 4];
    const shuffled = [...correctSeq].sort(() => Math.random() - 0.5);

    let placedSeq = [];
    let submitCb = null;

    container.innerHTML = `
      <div class="seq-container max-w-lg mx-auto p-4 flex flex-col items-center gap-6">
        <!-- Target slots -->
        <div class="flex items-center justify-center gap-3 w-full bg-blue-50/70 p-4 rounded-3xl border-2 border-blue-200 min-h-[90px]">
          ${correctSeq
            .map(
              (_, i) => `
            <div id="slot-${i}" class="w-16 h-16 rounded-2xl border-3 border-dashed border-blue-300 bg-white flex items-center justify-center text-3xl font-black text-blue-600">
            </div>
          `
            )
            .join('')}
        </div>

        <p class="text-gray-600 font-semibold text-center">Tap the numbers in order!</p>

        <!-- Shuffled numbers to tap -->
        <div id="shuffled-nums-row" class="flex items-center justify-center gap-3 flex-wrap">
        </div>
      </div>
    `;

    const row = container.querySelector('#shuffled-nums-row');

    function renderChoices() {
      row.innerHTML = '';
      shuffled.forEach((num, idx) => {
        const isPlaced = placedSeq.includes(num);
        const btn = createElement('button', {
          className: `w-16 h-16 rounded-2xl border-3 text-3xl font-black flex items-center justify-center transition-all ${
            isPlaced
              ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-default'
              : 'bg-white border-blue-400 text-blue-700 shadow-md hover:border-blue-600 active:scale-95'
          } min-h-[60px] min-w-[60px]`,
          textContent: String(num),
        });

        if (!isPlaced) {
          onTouch(btn, () => {
            const expected = correctSeq[placedSeq.length];
            if (num === expected) {
              // Correct next number
              const slotIdx = placedSeq.length;
              placedSeq.push(num);
              const slotEl = container.querySelector(`#slot-${slotIdx}`);
              if (slotEl) {
                slotEl.textContent = String(num);
                slotEl.classList.remove('border-dashed');
                slotEl.classList.add('bg-blue-100', 'border-blue-500');
              }
              renderChoices();

              if (placedSeq.length === correctSeq.length) {
                if (submitCb) submitCb({ correct: true });
              }
            } else {
              // Wrong next number
              btn.classList.add('border-rose-400', 'bg-rose-50');
              setTimeout(() => {
                btn.classList.remove('border-rose-400', 'bg-rose-50');
              }, 400);
              if (submitCb) submitCb({ correct: false, tapped: num, expected });
            }
          });
        }
        row.appendChild(btn);
      });
    }

    renderChoices();

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
        message: lang === 'mr' ? 'खूप छान! संख्या बरोबर क्रमाने लावल्यात! 🌟' : 'Awesome! Numbers are in the right order! 🌟',
      };
    }
    return {
      type: 'encouragement',
      message: lang === 'mr' ? 'सुरुवातीपासून मोजा आणि पुढचा अंक शोधा! 😊' : 'Count from the beginning and find the next number! 😊',
    };
  },
};

export default NumberSequence;

