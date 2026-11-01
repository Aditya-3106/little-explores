/**
 * @file feedback.js
 * @description Child-friendly visual celebrations, stars, encouraging hints, and completion modals.
 * Non-punitive: no harsh sounds, red failure alerts, or lost lives.
 * @module child/feedback
 */

import { createElement, onTouch } from '../utils/dom.js';
import { getMiloSVG } from './milo-mascot.js';
import { playFeedback } from '../utils/audio.js';

/**
 * Display gentle inline success feedback with celebration sparkles.
 * @param {HTMLElement} container
 * @param {string} message
 */
export function showCorrectCelebration(container, message = 'Wonderful!') {
  playFeedback('correct');

  const banner = createElement('div', {
    className: 'fixed inset-0 pointer-events-none z-50 flex items-center justify-center',
    innerHTML: `
      <div class="bg-emerald-500 text-white font-black text-2xl md:text-3xl px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 animate-bounce-gentle">
        <span>🌟</span>
        <span>${message}</span>
        <span>🎉</span>
      </div>
    `,
  });

  document.body.appendChild(banner);
  setTimeout(() => {
    banner.remove();
  }, 1600);
}

/**
 * Display encouraging retry guidance.
 * @param {HTMLElement} container
 * @param {string} hint
 */
export function showEncouragingHint(container, hint = "Let's try together!") {
  playFeedback('hint');

  const bubble = createElement('div', {
    className: 'mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center gap-3 text-amber-900 font-bold animate-fade-in shadow-sm',
    innerHTML: `
      <span class="text-2xl">💡</span>
      <span>${hint}</span>
    `,
  });

  container.appendChild(bubble);
  setTimeout(() => {
    bubble.remove();
  }, 3500);
}

/**
 * Show the full activity completion screen with Milo celebration and offline recommendation.
 * @param {HTMLElement} container
 * @param {Object} options
 */
export function showCompletionScreen(container, { title, learned, offlineSuggestion, onTryAnother, onBackWorld }) {
  playFeedback('complete');

  container.innerHTML = `
    <div class="completion-card max-w-lg mx-auto bg-white rounded-3xl p-6 md:p-8 border-4 border-amber-300 shadow-2xl text-center flex flex-col items-center gap-6 my-4 animate-fade-in">
      <div class="text-6xl animate-bounce-gentle">
        ${getMiloSVG('happy', 130)}
      </div>

      <div class="space-y-1">
        <h2 class="text-3xl font-black text-amber-950">Awesome Explorer! 🌟</h2>
        <p class="text-gray-600 font-semibold">${title || 'Activity Completed'}</p>
      </div>

      <!-- What was learned -->
      <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 w-full text-left">
        <div class="flex items-center gap-2 text-amber-800 font-bold mb-1 text-sm">
          <span>🎯</span>
          <span>You learned:</span>
        </div>
        <p class="text-amber-950 font-medium">${learned || 'Recognising concepts through playful interaction.'}</p>
      </div>

      <!-- Real world offline challenge -->
      ${
        offlineSuggestion
          ? `
        <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 w-full text-left">
          <div class="flex items-center gap-2 text-emerald-800 font-bold mb-1 text-sm">
            <span>🏡</span>
            <span>Home Challenge (Offline):</span>
          </div>
          <p class="text-emerald-950 font-medium">${offlineSuggestion}</p>
        </div>
      `
          : ''
      }

      <!-- Action buttons -->
      <div class="flex gap-4 w-full justify-center">
        <button id="btn-back-world" class="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl transition-all min-h-[48px]">
          Back to World 🌍
        </button>
        <button id="btn-try-another" class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 min-h-[48px]">
          Play Another! 🚀
        </button>
      </div>
    </div>
  `;

  const backBtn = container.querySelector('#btn-back-world');
  const anotherBtn = container.querySelector('#btn-try-another');

  if (backBtn && onBackWorld) onTouch(backBtn, onBackWorld);
  if (anotherBtn && onTryAnother) onTouch(anotherBtn, onTryAnother);
}

