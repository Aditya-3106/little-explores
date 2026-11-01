/**
 * @file drag-drop.js
 * @description ACT-03: Drag and Drop (with tap-to-move fallback for touch devices).
 * @module activities/types/drag-drop
 */

import { createElement, onTouch } from '../../utils/dom.js';

const DragDrop = {
  type: 'drag-drop',
  version: 1,
  name: { en: 'Drag and Drop', mr: 'ओढा आणि ठेवा' },
  description: {
    en: 'Move objects into appropriate positions',
    mr: 'वस्तू त्यांच्या योग्य जागी ओढा किंवा ठेवा',
  },
  icon: '👆',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    const payload = existingData?.payload || {
      targets: [
        { id: 't1', label: 'Big Box', icon: '📦', accepts: 'big' },
        { id: 't2', label: 'Small Box', icon: '📫', accepts: 'small' },
      ],
      items: [
        { id: 'i1', icon: '🐘', label: 'Elephant', type: 'big' },
        { id: 'i2', icon: '🐭', label: 'Mouse', type: 'small' },
      ],
    };

    container.innerHTML = `
      <div class="p-3 bg-gray-50 rounded">
        <p class="text-sm font-semibold">Drag and Drop targets and movable items are configured via payload.</p>
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
    return { valid: true, errors: [] };
  },

  render(activity, container, options = {}) {
    const targets = activity.payload?.targets || [
      { id: 't1', label: 'Box 1', icon: '📦', accepts: 'a' },
      { id: 't2', label: 'Box 2', icon: '📫', accepts: 'b' },
    ];
    const items = [...(activity.payload?.items || [
      { id: 'i1', icon: '🍎', label: 'Apple', type: 'a' },
      { id: 'i2', icon: '🍌', label: 'Banana', type: 'b' },
    ])].map((item) => ({ ...item, placed: false }));

    let selectedItemId = null;
    let placedCount = 0;
    let submitCb = null;

    container.innerHTML = `
      <div class="dd-container max-w-xl mx-auto p-4 flex flex-col gap-6">
        <!-- Draggable / Tappable items -->
        <div id="dd-items" class="flex flex-wrap gap-4 items-center justify-center p-4 bg-white rounded-3xl border border-gray-200 min-h-[90px]">
        </div>

        <!-- Drop target zones -->
        <div class="grid grid-cols-2 gap-4">
          ${targets
            .map(
              (t) => `
            <div data-target-id="${t.id}" class="dd-zone bg-purple-50/70 border-3 border-dashed border-purple-300 hover:border-purple-500 rounded-3xl p-4 flex flex-col items-center min-h-[140px] cursor-pointer">
              <span class="text-3xl mb-1">${t.icon}</span>
              <span class="font-bold text-purple-900">${t.label}</span>
              <div class="zone-contents flex flex-wrap gap-2 mt-2"></div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    const itemsContainer = container.querySelector('#dd-items');
    const zones = container.querySelectorAll('.dd-zone');

    function renderItems() {
      itemsContainer.innerHTML = '';
      const remaining = items.filter((i) => !i.placed);

      if (remaining.length === 0) {
        itemsContainer.innerHTML = '<span class="text-emerald-600 font-bold">All placed! 🎉</span>';
        if (submitCb) submitCb({ correct: true });
        return;
      }

      remaining.forEach((item) => {
        const btn = createElement('button', {
          className: `p-3 rounded-2xl border-2 flex items-center gap-2 transition-all min-h-[52px] ${
            selectedItemId === item.id
              ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-200 scale-105'
              : 'bg-white border-purple-200 shadow-sm'
          }`,
        });
        btn.innerHTML = `<span class="text-3xl">${item.icon}</span><span class="text-sm font-bold text-gray-700">${item.label || ''}</span>`;

        onTouch(btn, () => {
          selectedItemId = item.id;
          renderItems();
        });

        itemsContainer.appendChild(btn);
      });
    }

    zones.forEach((zone) => {
      const targetId = zone.dataset.targetId;
      const targetObj = targets.find((t) => t.id === targetId);

      onTouch(zone, () => {
        if (!selectedItemId) return;

        const currentItem = items.find((i) => i.id === selectedItemId);
        if (!currentItem) return;

        if (targetObj.accepts === currentItem.type) {
          currentItem.placed = true;
          selectedItemId = null;
          placedCount++;

          const placedTag = createElement('span', {
            className: 'text-2xl p-1 bg-white rounded-lg shadow-xs',
            textContent: currentItem.icon,
          });
          zone.querySelector('.zone-contents').appendChild(placedTag);
          renderItems();
        } else {
          zone.classList.add('border-rose-400', 'bg-rose-50');
          setTimeout(() => {
            zone.classList.remove('border-rose-400', 'bg-rose-50');
          }, 400);
          if (submitCb) submitCb({ correct: false });
        }
      });
    });

    renderItems();

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
        ? (lang === 'mr' ? 'शाब्बास! बरोबर ठिकाणी ठेवले! 🌟' : 'Awesome! Right into the spot! 🌟')
        : (lang === 'mr' ? 'दुसऱ्या जागी ठेवून पहा! 😊' : 'Try placing it in another spot! 😊'),
    };
  },
};

export default DragDrop;

