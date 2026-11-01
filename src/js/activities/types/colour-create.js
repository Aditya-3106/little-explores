/**
 * @file colour-create.js
 * @description ACT-17: Colour and Create activity type.
 * Simple coloring canvas with vibrant palette for creative expression.
 * Open-ended creative task (completed when finished coloring).
 * @module activities/types/colour-create
 */

import { createElement, onTouch } from '../../utils/dom.js';

const ColourCreate = {
  type: 'colour-create',
  version: 1,
  name: { en: 'Colour and Create', mr: 'रंगवा आणि तयार करा' },
  description: {
    en: 'Complete creative tasks',
    mr: 'चित्रांमध्ये आवडीचे रंग भरा',
  },
  icon: '🎨',
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
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#000000'];
    let selectedColor = colors[0];

    container.innerHTML = `
      <div class="colour-container max-w-md mx-auto p-4 flex flex-col items-center gap-4">
        <!-- Palette -->
        <div class="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
          ${colors
            .map(
              (c, i) => `
            <button data-color="${c}" class="palette-btn w-9 h-9 rounded-full border-2 transition-transform ${
                i === 0 ? 'scale-125 border-gray-800' : 'border-white'
              }" style="background-color: ${c}"></button>
          `
            )
            .join('')}
        </div>

        <!-- Canvas -->
        <div class="bg-white rounded-3xl border-3 border-amber-200 shadow-md overflow-hidden relative">
          <canvas id="colour-canvas" width="280" height="280" class="cursor-pointer"></canvas>
          <div class="absolute inset-0 flex items-center justify-center text-8xl opacity-15 pointer-events-none select-none">
            🦋
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <button id="colour-clear" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl min-h-[48px]">
            Clear 🔄
          </button>
          <button id="colour-done" class="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm min-h-[48px]">
            Done Painting! 🎨
          </button>
        </div>
      </div>
    `;

    const canvas = container.querySelector('#colour-canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedColor;

    const paletteBtns = container.querySelectorAll('.palette-btn');
    paletteBtns.forEach((btn) => {
      onTouch(btn, () => {
        selectedColor = btn.dataset.color;
        ctx.strokeStyle = selectedColor;
        paletteBtns.forEach((b) => b.classList.remove('scale-125', 'border-gray-800'));
        btn.classList.add('scale-125', 'border-gray-800');
      });
    });

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    const start = (e) => {
      isDrawing = true;
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      if (e.cancelable) e.preventDefault();
    };

    const draw = (e) => {
      if (!isDrawing) return;
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      if (e.cancelable) e.preventDefault();
    };

    const stop = () => {
      isDrawing = false;
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stop);

    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stop);

    container.querySelector('#colour-clear').addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    container.querySelector('#colour-done').addEventListener('click', () => {
      if (submitCb) submitCb({ correct: true });
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
      correct: true,
      score: 1,
      details: response,
    };
  },

  getFeedback(activity, response, lang = 'en') {
    return {
      type: 'success',
      message: lang === 'mr' ? 'किती सुंदर रंगवले आहेस! अप्रतिम कला! 🌟' : 'What a beautiful creation! Great artist! 🌟',
    };
  },
};

export default ColourCreate;

