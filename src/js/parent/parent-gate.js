/**
 * @file parent-gate.js
 * @description Parent Access Gate with 4-digit PIN check & cognitive math challenge fallback.
 * Prevents young children from accidental access into the authoring studio.
 * @module parent/parent-gate
 */

import { createElement, onTouch } from '../utils/dom.js';
import { navigateTo } from '../core/router.js';

const PIN_STORAGE_KEY = 'le_parent_pin';
const DEFAULT_PIN = '1234';

export function isParentUnlocked() {
  return sessionStorage.getItem('le_parent_unlocked') === 'true';
}

export function lockParentArea() {
  sessionStorage.removeItem('le_parent_unlocked');
}

export function renderParentGate(container, onSuccess) {
  let enteredPin = '';
  const storedPin = localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;

  // Cognitive challenge numbers
  const num1 = Math.floor(Math.random() * 8) + 3;
  const num2 = Math.floor(Math.random() * 7) + 2;
  const mathAnswer = num1 + num2;

  container.innerHTML = `
    <div class="parent-gate-card max-w-sm mx-auto my-8 bg-white rounded-3xl p-6 md:p-8 border-2 border-gray-200 shadow-xl text-center">
      <div class="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
        🔒
      </div>
      <h2 class="text-2xl font-black text-gray-900 mb-1">Parent Gate</h2>
      <p class="text-xs text-gray-500 mb-6">Enter your 4-digit PIN to access Parent Studio (Default: 1234)</p>

      <!-- PIN Display Dots -->
      <div class="flex justify-center gap-3 mb-6" id="pin-dots">
        <div class="w-4 h-4 rounded-full border-2 border-gray-300"></div>
        <div class="w-4 h-4 rounded-full border-2 border-gray-300"></div>
        <div class="w-4 h-4 rounded-full border-2 border-gray-300"></div>
        <div class="w-4 h-4 rounded-full border-2 border-gray-300"></div>
      </div>

      <!-- Keypad -->
      <div class="grid grid-cols-3 gap-3 mb-6" id="pin-pad">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9]
          .map(
            (n) => `
          <button data-digit="${n}" class="digit-btn p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-xl font-bold text-gray-800 transition-all active:scale-95 min-h-[48px]">
            ${n}
          </button>
        `
          )
          .join('')}
        <button id="pin-clear" class="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-sm font-bold text-gray-500 min-h-[48px]">Clear</button>
        <button data-digit="0" class="digit-btn p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-xl font-bold text-gray-800 active:scale-95 min-h-[48px]">0</button>
        <button id="pin-back" class="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-lg font-bold text-gray-600 min-h-[48px]">⌫</button>
      </div>

      <!-- Forgot PIN Math Challenge -->
      <div class="border-t pt-4 text-left">
        <button id="toggle-math-btn" class="text-xs text-blue-600 font-bold hover:underline">
          Forgot PIN? Solve challenge
        </button>
        <div id="math-challenge-box" class="hidden mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
          <label class="block text-xs font-semibold text-blue-900">Parent Check: What is ${num1} + ${num2}?</label>
          <div class="flex gap-2">
            <input type="number" id="math-ans-input" class="w-full p-2 border rounded text-sm" placeholder="Answer">
            <button id="math-submit-btn" class="px-4 py-2 bg-blue-600 text-white rounded font-bold text-xs">Unlock</button>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <button id="gate-return-play" class="text-xs font-bold text-gray-500 hover:text-gray-800">
          ← Return to Learning Playground
        </button>
      </div>
    </div>
  `;

  const dots = container.querySelectorAll('#pin-dots div');

  function updateDots() {
    dots.forEach((dot, idx) => {
      if (idx < enteredPin.length) {
        dot.className = 'w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-600';
      } else {
        dot.className = 'w-4 h-4 rounded-full border-2 border-gray-300';
      }
    });

    if (enteredPin.length === 4) {
      if (enteredPin === storedPin) {
        sessionStorage.setItem('le_parent_unlocked', 'true');
        if (onSuccess) onSuccess();
        else navigateTo('/parent/dashboard');
      } else {
        // Wrong PIN
        dots.forEach((d) => (d.className = 'w-4 h-4 rounded-full bg-rose-500 border-2 border-rose-500'));
        setTimeout(() => {
          enteredPin = '';
          updateDots();
        }, 500);
      }
    }
  }

  container.querySelectorAll('.digit-btn').forEach((btn) => {
    onTouch(btn, () => {
      if (enteredPin.length < 4) {
        enteredPin += btn.dataset.digit;
        updateDots();
      }
    });
  });

  const clearBtn = container.querySelector('#pin-clear');
  if (clearBtn) {
    onTouch(clearBtn, () => {
      enteredPin = '';
      updateDots();
    });
  }

  const backDigitBtn = container.querySelector('#pin-back');
  if (backDigitBtn) {
    onTouch(backDigitBtn, () => {
      enteredPin = enteredPin.slice(0, -1);
      updateDots();
    });
  }

  const toggleMath = container.querySelector('#toggle-math-btn');
  const mathBox = container.querySelector('#math-challenge-box');
  if (toggleMath && mathBox) {
    onTouch(toggleMath, () => {
      mathBox.classList.toggle('hidden');
    });
  }

  const mathSubmit = container.querySelector('#math-submit-btn');
  if (mathSubmit) {
    onTouch(mathSubmit, () => {
      const val = parseInt(container.querySelector('#math-ans-input').value, 10);
      if (val === mathAnswer) {
        sessionStorage.setItem('le_parent_unlocked', 'true');
        if (onSuccess) onSuccess();
        else navigateTo('/parent/dashboard');
      } else {
        alert('Incorrect answer. Please try again.');
      }
    });
  }

  const returnBtn = container.querySelector('#gate-return-play');
  if (returnBtn) {
    onTouch(returnBtn, () => navigateTo('/play'));
  }
}

