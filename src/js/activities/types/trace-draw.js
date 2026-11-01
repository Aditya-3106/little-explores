/**
 * @file trace-draw.js
 * @description ACT-16: Trace and Draw activity type.
 * HTML5 Canvas tracing for shapes, letters, numbers, and fine motor coordination.
 * Open-ended completion (marked complete upon interaction).
 * @module activities/types/trace-draw
 */

import { createElement, onTouch } from '../../utils/dom.js';

const TraceDraw = {
  type: 'trace-draw',
  version: 1,
  name: { en: 'Trace and Draw', mr: 'ट्रेस करा आणि काढा' },
  description: {
    en: 'Trace simple shapes and lines',
    mr: 'रेषा, आकार किंवा अक्षरे गिरवा',
  },
  icon: '✏️',
  ageGroups: ['nursery', 'lkg'],

  createEditor(container, existingData) {
    return {
      getData: () => existingData?.payload || { guideText: 'A' },
      validate: () => ({ valid: true, errors: [] }),
      destroy() {},
    };
  },

  validate(activity) {
    return { valid: true, errors: [] };
  },

  render(activity, container, options = {}) {
    const guideText = activity.payload?.guideText || 'O';
    let submitCb = null;
    let strokesDrawn = 0;

    container.innerHTML = `
      <div class="trace-container max-w-md mx-auto p-4 flex flex-col items-center gap-4">
        <p class="text-gray-600 font-semibold text-center">Trace the shape with your finger or mouse!</p>

        <div class="relative bg-white rounded-3xl border-3 border-purple-200 shadow-md overflow-hidden">
          <canvas id="trace-canvas" width="280" height="280" class="cursor-crosshair"></canvas>
          <div id="guide-overlay" class="absolute inset-0 flex items-center justify-center text-9xl font-black text-gray-200 select-none pointer-events-none">
            ${guideText}
          </div>
        </div>

        <div class="flex gap-4">
          <button id="trace-clear" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl min-h-[48px]">
            Clear 🔄
          </button>
          <button id="trace-done" class="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm min-h-[48px]">
            I'm Done! ✨
          </button>
        </div>
      </div>
    `;

    const canvas = container.querySelector('#trace-canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }

    const startDraw = (e) => {
      isDrawing = true;
      strokesDrawn++;
      const pos = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      if (e.cancelable) e.preventDefault();
    };

    const draw = (e) => {
      if (!isDrawing) return;
      const pos = getCoords(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      if (e.cancelable) e.preventDefault();
    };

    const stopDraw = () => {
      isDrawing = false;
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDraw);

    container.querySelector('#trace-clear').addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    container.querySelector('#trace-done').addEventListener('click', () => {
      if (submitCb) submitCb({ correct: true, strokesDrawn });
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
      correct: true, // open-ended fine motor challenge
      score: 1,
      details: response,
    };
  },

  getFeedback(activity, response, lang = 'en') {
    return {
      type: 'success',
      message: lang === 'mr' ? 'खूप सुंदर गिरवले! उत्तम सराव! 🌟' : 'Wonderful tracing and fine motor practice! 🌟',
    };
  },
};

export default TraceDraw;

