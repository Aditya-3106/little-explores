/**
 * @file picture-sequence.js
 * @description ACT-09: Picture Sequence activity type.
 * Children arrange sequential pictures (e.g. seed -> plant -> flower) in temporal/logical order.
 * @module activities/types/picture-sequence
 */

import { createElement, onTouch } from '../../utils/dom.js';

const PictureSequence = {
  type: 'picture-sequence',
  version: 1,
  name: { en: 'Picture Sequence', mr: 'चित्र क्रम' },
  description: {
    en: 'Arrange pictures in the correct order',
    mr: 'चित्रे योग्य क्रमाने लावा',
  },
  icon: '🖼️',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    const payload = existingData?.payload || {
      steps: [
        { id: 's1', icon: '🌱', label: 'Seed' },
        { id: 's2', icon: '🌿', label: 'Plant' },
        { id: 's3', icon: '🌸', label: 'Flower' },
      ],
    };

    container.innerHTML = `<div class="p-3 bg-gray-50 rounded"><p class="text-sm">Configured with ordered picture story steps.</p></div>`;

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
    const steps = activity.payload?.steps || [
      { id: 's1', icon: '🌱', label: 'Sprout' },
      { id: 's2', icon: '🌿', label: 'Growing' },
      { id: 's3', icon: '🌸', label: 'Blooming' },
    ];

    const shuffled = [...steps].sort(() => Math.random() - 0.5);
    const placed = [];
    let submitCb = null;

    container.innerHTML = `
      <div class="pic-seq-container max-w-lg mx-auto p-4 flex flex-col items-center gap-6">
        <!-- Sequence Slots -->
        <div class="flex items-center justify-center gap-3 w-full bg-emerald-50/70 p-4 rounded-3xl border-2 border-emerald-200 min-h-[100px]">
          ${steps
            .map(
              (_, i) => `
            <div id="ps-slot-${i}" class="w-20 h-20 rounded-2xl border-3 border-dashed border-emerald-300 bg-white flex flex-col items-center justify-center text-3xl font-bold">
            </div>
          `
            )
            .join('')}
        </div>

        <p class="text-gray-600 font-semibold text-center">Tap what happens first, next, and last!</p>

        <!-- Choices -->
        <div id="ps-choices" class="flex items-center justify-center gap-4 flex-wrap"></div>
      </div>
    `;

    const choicesDiv = container.querySelector('#ps-choices');

    function renderChoices() {
      choicesDiv.innerHTML = '';
      shuffled.forEach((step) => {
        const isPlaced = placed.includes(step.id);
        const btn = createElement('button', {
          className: `p-3 rounded-2xl border-3 flex flex-col items-center justify-center min-w-[70px] min-h-[70px] transition-all ${
            isPlaced
              ? 'bg-gray-100 border-gray-200 opacity-40 cursor-default'
              : 'bg-white border-emerald-300 shadow-md hover:border-emerald-500 active:scale-95'
          }`,
        });
        btn.innerHTML = `<span class="text-4xl">${step.icon}</span><span class="text-xs font-bold text-gray-700 mt-1">${step.label}</span>`;

        if (!isPlaced) {
          onTouch(btn, () => {
            const expected = steps[placed.length];
            if (step.id === expected.id) {
              const slotIdx = placed.length;
              placed.push(step.id);
              const slotEl = container.querySelector(`#ps-slot-${slotIdx}`);
              if (slotEl) {
                slotEl.innerHTML = `<span class="text-3xl">${step.icon}</span><span class="text-[10px] text-gray-500">${step.label}</span>`;
                slotEl.classList.remove('border-dashed');
                slotEl.classList.add('bg-emerald-100', 'border-emerald-500');
              }
              renderChoices();

              if (placed.length === steps.length && submitCb) {
                submitCb({ correct: true });
              }
            } else {
              btn.classList.add('border-rose-400');
              setTimeout(() => btn.classList.remove('border-rose-400'), 400);
              if (submitCb) submitCb({ correct: false });
            }
          });
        }
        choicesDiv.appendChild(btn);
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
    return {
      type: response.correct ? 'success' : 'encouragement',
      message: response.correct
        ? (lang === 'mr' ? 'छान गोष्ट सांगितली! क्रम अगदी बरोबर! 🌟' : 'Wonderful story! The sequence is perfect! 🌟')
        : (lang === 'mr' ? 'सुरुवातीला काय घडते ते विचार करा! 😊' : 'Think what happens first, then next! 😊'),
    };
  },
};

export default PictureSequence;

