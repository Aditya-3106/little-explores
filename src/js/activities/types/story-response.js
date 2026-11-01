/**
 * @file story-response.js
 * @description ACT-15: Story and Respond activity type.
 * Children listen to or read a short illustrated story and answer comprehension questions.
 * @module activities/types/story-response
 */

import { createElement, onTouch } from '../../utils/dom.js';
import { speak } from '../../utils/audio.js';

const StoryResponse = {
  type: 'story-response',
  version: 1,
  name: { en: 'Story and Respond', mr: 'गोष्ट आणि प्रतिसाद' },
  description: {
    en: 'Listen to a story and respond',
    mr: 'गोष्ट ऐका आणि साध्या प्रश्नांची उत्तरे द्या',
  },
  icon: '📖',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    const payload = existingData?.payload || {
      storyText: 'Milo the fox found a big yellow mango under the tall green tree.',
      storyEmoji: '🦊 🥭 🌳',
      question: 'What did Milo find?',
      options: ['A mango 🥭', 'An apple 🍎', 'A ball ⚽'],
      correctAnswer: 0,
    };

    container.innerHTML = `<div class="p-3 bg-gray-50 rounded"><p class="text-sm">Configured with short story and question options.</p></div>`;

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
    const lang = options.language || 'en';
    const loc = activity.locales?.[lang] || activity.locales?.en || {};
    const p = activity.payload || {};

    const storyText = loc.story || p.storyText || 'Once upon a time, Milo saw a bright yellow star!';
    const storyEmoji = p.storyEmoji || '🦊 ⭐ 🌙';
    const question = loc.question || p.question || 'What did Milo see?';
    const optionsList = loc.options || p.options || ['A star ⭐', 'A car 🚗', 'A spoon 🥄'];
    const correctIdx = p.correctAnswer ?? 0;

    let submitCb = null;

    container.innerHTML = `
      <div class="story-container max-w-lg mx-auto p-4 flex flex-col items-center gap-6">
        <!-- Story Illustration Card -->
        <div class="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-6 text-center shadow-sm w-full">
          <div class="text-6xl mb-3">${storyEmoji}</div>
          <p class="text-xl font-medium text-indigo-950 leading-relaxed mb-4">${storyText}</p>
          <button id="sr-read-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-full font-bold shadow-sm hover:bg-indigo-700 flex items-center gap-2 mx-auto min-h-[48px]">
            <span>🔊 Read Story</span>
          </button>
        </div>

        <!-- Question & Options -->
        <div class="w-full">
          <p class="text-lg font-bold text-gray-800 text-center mb-4">${question}</p>
          <div class="flex flex-col gap-3">
            ${optionsList
              .map(
                (opt, i) => `
              <button data-opt-idx="${i}" class="sr-option p-4 bg-white border-2 border-purple-200 hover:border-purple-400 rounded-2xl shadow-sm text-left text-lg font-semibold text-gray-800 transition-all flex items-center justify-between min-h-[56px]">
                <span>${opt}</span>
                <span class="text-purple-400 font-bold">👉</span>
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    const readBtn = container.querySelector('#sr-read-btn');
    if (readBtn) {
      onTouch(readBtn, () => {
        speak(storyText, lang);
      });
    }

    const optionBtns = container.querySelectorAll('.sr-option');
    optionBtns.forEach((btn) => {
      onTouch(btn, () => {
        const idx = parseInt(btn.dataset.optIdx, 10);
        if (idx === correctIdx) {
          btn.classList.add('bg-emerald-50', 'border-emerald-500');
          if (submitCb) submitCb({ correct: true, choice: optionsList[idx] });
        } else {
          btn.classList.add('bg-rose-50', 'border-rose-400');
          setTimeout(() => btn.classList.remove('bg-rose-50', 'border-rose-400'), 400);
          if (submitCb) submitCb({ correct: false, choice: optionsList[idx] });
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
        ? (lang === 'mr' ? 'शाब्बास! गोष्ट छान समजली! 🌟' : 'Wonderful listening! You understood the story! 🌟')
        : (lang === 'mr' ? 'गोष्ट पुन्हा एकदा ऐका आणि विचार करा! 😊' : 'Listen to the story once more and try again! 😊'),
    };
  },
};

export default StoryResponse;

