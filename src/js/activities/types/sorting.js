/**
 * @file sorting.js
 * @description ACT-06: Sorting Game activity type.
 * Children sort items into 2 or 3 distinct categories by tapping an item then tapping its category.
 * @module activities/types/sorting
 */

import { createElement, onTouch } from '../../utils/dom.js';

const Sorting = {
  type: 'sorting',
  version: 1,
  name: { en: 'Sorting Game', mr: 'वर्गीकरण खेळ' },
  description: {
    en: 'Sort objects into categories',
    mr: 'वस्तू त्यांच्या योग्य गटात वर्गीकरण करा',
  },
  icon: '🗂️',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    const payload = existingData?.payload || {
      categories: [
        { id: 'fruits', name: 'Fruits', icon: '🍎' },
        { id: 'veggies', name: 'Vegetables', icon: '🥕' },
      ],
      items: [
        { id: 'i1', label: 'Banana', icon: '🍌', categoryId: 'fruits' },
        { id: 'i2', label: 'Broccoli', icon: '🥦', categoryId: 'veggies' },
        { id: 'i3', label: 'Apple', icon: '🍎', categoryId: 'fruits' },
        { id: 'i4', label: 'Carrot', icon: '🥕', categoryId: 'veggies' },
      ],
    };

    container.innerHTML = `
      <div class="space-y-4">
        <p class="text-sm text-gray-500">Configure 2 categories and items to sort.</p>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 border rounded bg-gray-50">
            <label class="block text-xs font-bold text-gray-600 mb-1">Category 1 Name & Emoji</label>
            <input type="text" id="sort-cat1-name" class="w-full p-2 border rounded mb-2" value="${payload.categories[0]?.name || ''}">
            <input type="text" id="sort-cat1-icon" class="w-full p-2 border rounded" value="${payload.categories[0]?.icon || ''}">
          </div>
          <div class="p-3 border rounded bg-gray-50">
            <label class="block text-xs font-bold text-gray-600 mb-1">Category 2 Name & Emoji</label>
            <input type="text" id="sort-cat2-name" class="w-full p-2 border rounded mb-2" value="${payload.categories[1]?.name || ''}">
            <input type="text" id="sort-cat2-icon" class="w-full p-2 border rounded" value="${payload.categories[1]?.icon || ''}">
          </div>
        </div>
      </div>
    `;

    return {
      getData() {
        return payload;
      },
      validate() {
        return { valid: true, errors: [] };
      },
      destroy() {},
    };
  },

  validate(activity) {
    if (!activity.payload?.categories || !activity.payload?.items) {
      return { valid: false, errors: ['Sorting requires categories and items'] };
    }
    return { valid: true, errors: [] };
  },

  render(activity, container, options = {}) {
    const categories = activity.payload?.categories || [
      { id: 'c1', name: 'Category 1', icon: '📦' },
      { id: 'c2', name: 'Category 2', icon: '🧺' },
    ];
    const items = [...(activity.payload?.items || [])].map((item) => ({ ...item, sorted: false }));

    let selectedItemId = null;
    let sortedCount = 0;
    let submitCb = null;

    container.innerHTML = `
      <div class="sorting-container max-w-xl mx-auto p-4 flex flex-col gap-6">
        <!-- Items to sort -->
        <div id="sort-items-bar" class="flex flex-wrap items-center justify-center gap-3 p-4 bg-white rounded-3xl border border-purple-100 shadow-sm min-h-[90px]">
        </div>

        <!-- Categories Baskets -->
        <div class="grid grid-cols-2 gap-4">
          ${categories
            .map(
              (cat) => `
            <div data-cat-id="${cat.id}" class="category-bin bg-indigo-50/60 border-3 border-indigo-200 hover:border-indigo-400 rounded-3xl p-4 flex flex-col items-center min-h-[160px] transition-all cursor-pointer">
              <span class="text-4xl mb-1">${cat.icon || '📦'}</span>
              <span class="font-bold text-indigo-900">${cat.name}</span>
              <div class="bin-contents flex flex-wrap gap-2 mt-3 justify-center"></div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    const itemsBar = container.querySelector('#sort-items-bar');
    const bins = container.querySelectorAll('.category-bin');

    function renderActiveItems() {
      itemsBar.innerHTML = '';
      const remaining = items.filter((i) => !i.sorted);

      if (remaining.length === 0) {
        itemsBar.innerHTML = '<span class="text-emerald-600 font-bold">All items sorted! 🎉</span>';
        if (submitCb) submitCb({ correct: true, total: items.length });
        return;
      }

      remaining.forEach((item) => {
        const btn = createElement('button', {
          className: `p-3 rounded-2xl border-2 flex items-center gap-2 transition-all min-h-[52px] ${
            selectedItemId === item.id
              ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-200 scale-105'
              : 'bg-gray-50 border-gray-200 hover:border-purple-300'
          }`,
        });
        btn.innerHTML = `<span class="text-3xl">${item.icon || '🔹'}</span><span class="font-bold text-sm text-gray-700">${item.label || ''}</span>`;

        onTouch(btn, () => {
          selectedItemId = item.id;
          renderActiveItems();
        });

        itemsBar.appendChild(btn);
      });
    }

    bins.forEach((bin) => {
      const catId = bin.dataset.catId;
      onTouch(bin, () => {
        if (!selectedItemId) return;

        const targetItem = items.find((i) => i.id === selectedItemId);
        if (!targetItem) return;

        if (targetItem.categoryId === catId) {
          // Correct sort
          targetItem.sorted = true;
          selectedItemId = null;
          sortedCount++;

          const placedTag = createElement('span', {
            className: 'text-2xl p-1 bg-white rounded-lg shadow-xs border border-indigo-100',
            textContent: targetItem.icon || '🔹',
          });
          bin.querySelector('.bin-contents').appendChild(placedTag);

          renderActiveItems();
        } else {
          // Wrong bin
          bin.classList.add('border-rose-400', 'bg-rose-50');
          setTimeout(() => {
            bin.classList.remove('border-rose-400', 'bg-rose-50');
          }, 400);
          if (submitCb) submitCb({ correct: false, targetItem, catId });
        }
      });
    });

    renderActiveItems();

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
        message: lang === 'mr' ? 'छान वर्गीकरण केले! सर्व वस्तू जागेवर गेल्या! 🌟' : 'Super sorting! Everything is in place! 🌟',
      };
    }
    return {
      type: 'encouragement',
      message: lang === 'mr' ? 'काळजीपूर्वक विचार करा आणि योग्य गटात टाका! 😊' : 'Think carefully, which group does it belong to? 😊',
    };
  },
};

export default Sorting;

