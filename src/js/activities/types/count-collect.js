/**
 * @file count-collect.js
 * @description ACT-05: Count and Collect activity type.
 * Children collect a specific number of items by tapping them into a basket or collection zone.
 * @module activities/types/count-collect
 */

import { createElement, onTouch } from '../../utils/dom.js';

const CountCollect = {
  type: 'count-collect',
  version: 1,
  name: { en: 'Count and Collect', mr: 'मोजा आणि गोळा करा' },
  description: {
    en: 'Collect a specified number of objects',
    mr: 'आवश्यक तितक्या वस्तू मोजून गोळा करा',
  },
  icon: '🧺',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    const payload = existingData?.payload || {
      targetEmoji: '🍎',
      targetCount: 3,
      totalAvailable: 6,
    };

    container.innerHTML = `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Target Object (Emoji/Icon)</label>
          <input type="text" id="cc-emoji" class="w-full mt-1 p-2 border rounded" value="${payload.targetEmoji}">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Target Count to Collect (1-10)</label>
          <input type="number" id="cc-target" min="1" max="10" class="w-full mt-1 p-2 border rounded" value="${payload.targetCount}">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Total Items in Field</label>
          <input type="number" id="cc-total" min="2" max="15" class="w-full mt-1 p-2 border rounded" value="${payload.totalAvailable}">
        </div>
      </div>
    `;

    return {
      getData() {
        return {
          targetEmoji: container.querySelector('#cc-emoji').value.trim() || '🍎',
          targetCount: parseInt(container.querySelector('#cc-target').value, 10) || 3,
          totalAvailable: parseInt(container.querySelector('#cc-total').value, 10) || 6,
        };
      },
      validate() {
        const target = parseInt(container.querySelector('#cc-target').value, 10);
        const total = parseInt(container.querySelector('#cc-total').value, 10);
        if (target < 1 || target > total) {
          return { valid: false, errors: ['Target count must be at least 1 and no more than total available.'] };
        }
        return { valid: true, errors: [] };
      },
      destroy() {},
    };
  },

  validate(activity) {
    const p = activity.payload;
    if (!p || !p.targetCount) {
      return { valid: false, errors: ['Count and Collect requires targetCount'] };
    }
    return { valid: true, errors: [] };
  },

  render(activity, container, options = {}) {
    const p = activity.payload;
    const targetEmoji = p.targetEmoji || '🍎';
    const targetCount = p.targetCount || 3;
    const total = Math.max(targetCount, p.totalAvailable || 6);

    let collected = 0;
    let submitCb = null;

    container.innerHTML = `
      <div class="flex flex-col items-center max-w-lg mx-auto p-4 gap-6">
        <!-- Collection Goal Bar -->
        <div class="bg-amber-100 border-2 border-amber-300 rounded-2xl px-6 py-3 flex items-center gap-4 text-xl font-bold text-amber-900 shadow-sm">
          <span>Collect: ${targetCount} ${targetEmoji}</span>
          <span class="text-2xl font-black text-amber-700" id="cc-counter">${collected} / ${targetCount}</span>
        </div>

        <!-- Basket Dropzone -->
        <div id="cc-basket" class="w-full bg-orange-50 border-4 border-dashed border-orange-300 rounded-3xl min-h-[120px] p-4 flex flex-wrap items-center justify-center gap-3 transition-all">
          <span id="cc-basket-empty" class="text-gray-400 font-medium">Tap objects below to collect them into your basket 🧺</span>
        </div>

        <!-- Objects Field -->
        <div id="cc-field" class="flex flex-wrap items-center justify-center gap-4 p-4 bg-white rounded-3xl shadow-md border border-gray-100 w-full">
        </div>
      </div>
    `;

    const field = container.querySelector('#cc-field');
    const basket = container.querySelector('#cc-basket');
    const basketEmpty = container.querySelector('#cc-basket-empty');
    const counter = container.querySelector('#cc-counter');

    for (let i = 0; i < total; i++) {
      const btn = createElement('button', {
        className: 'w-16 h-16 text-4xl bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-95 min-h-[56px] min-w-[56px]',
        innerHTML: targetEmoji,
      });

      onTouch(btn, () => {
        if (btn.classList.contains('collected')) return;

        btn.classList.add('collected', 'opacity-30', 'scale-90');
        collected++;
        counter.textContent = `${collected} / ${targetCount}`;

        // Add to basket visually
        if (basketEmpty) basketEmpty.classList.add('hidden');
        const basketItem = createElement('span', {
          className: 'text-4xl animate-bounce-gentle',
          textContent: targetEmoji,
        });
        basket.appendChild(basketItem);

        if (collected === targetCount) {
          basket.classList.add('border-emerald-400', 'bg-emerald-50');
          if (submitCb) {
            submitCb({ correct: true, count: collected, targetCount });
          }
        } else if (collected > targetCount) {
          // Gently indicate too many
          if (submitCb) {
            submitCb({ correct: false, count: collected, targetCount });
          }
        }
      });

      field.appendChild(btn);
    }

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
        message: lang === 'mr' ? 'शाब्बास! बरोबर मोजून गोळा केले! 🌟' : 'Awesome! You collected the right number! 🌟',
      };
    }
    return {
      type: 'encouragement',
      message: lang === 'mr' ? 'थोडं जास्त गोळा झालं, पुन्हा प्रयत्न करा! 😊' : 'A few too many! Let us try again! 😊',
    };
  },
};

export default CountCollect;

