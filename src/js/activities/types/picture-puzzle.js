/**
 * @file picture-puzzle.js
 * @description ACT-14: Picture Puzzle activity type (2x2 simple jigsaw).
 * @module activities/types/picture-puzzle
 */

import { createElement, onTouch } from '../../utils/dom.js';

const PicturePuzzle = {
  type: 'picture-puzzle',
  version: 1,
  name: { en: 'Picture Puzzle', mr: 'चित्र कोडे' },
  description: {
    en: 'Solve simple visual puzzles',
    mr: 'तुकडे एकत्र करून संपूर्ण चित्र बनवा',
  },
  icon: '🖼️',
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
    const pieces = [
      { id: 'p1', pos: 0, icon: '🐻', name: 'Ears' },
      { id: 'p2', pos: 1, icon: '👀', name: 'Eyes' },
      { id: 'p3', pos: 2, icon: '👃', name: 'Nose' },
      { id: 'p4', pos: 3, icon: '🍯', name: 'Honey' },
    ];

    const shuffled = [...pieces].sort(() => Math.random() - 0.5);
    const placed = [];

    container.innerHTML = `
      <div class="puzzle-container max-w-md mx-auto p-4 flex flex-col items-center gap-6">
        <!-- 2x2 Target Grid -->
        <div class="grid grid-cols-2 gap-2 bg-amber-50 p-3 rounded-3xl border-3 border-amber-300 w-56 h-56 shadow-inner">
          ${pieces
            .map(
              (p, i) => `
            <div id="puz-slot-${i}" class="bg-white border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-center text-4xl">
            </div>
          `
            )
            .join('')}
        </div>

        <p class="text-gray-600 font-semibold text-center">Tap pieces below in order (1 to 4) to solve the puzzle!</p>

        <!-- Shuffled pieces -->
        <div id="puz-pieces" class="flex gap-3 flex-wrap justify-center"></div>
      </div>
    `;

    const piecesRow = container.querySelector('#puz-pieces');

    function renderPieces() {
      piecesRow.innerHTML = '';
      shuffled.forEach((piece) => {
        const isPlaced = placed.includes(piece.id);
        const btn = createElement('button', {
          className: `w-16 h-16 rounded-2xl border-2 text-3xl flex items-center justify-center transition-all ${
            isPlaced
              ? 'bg-gray-100 border-gray-200 opacity-30 cursor-default'
              : 'bg-white border-purple-300 shadow-md hover:border-purple-500 active:scale-95'
          }`,
          innerHTML: piece.icon,
        });

        if (!isPlaced) {
          onTouch(btn, () => {
            const currentSlot = placed.length;
            if (piece.pos === currentSlot) {
              placed.push(piece.id);
              const slot = container.querySelector(`#puz-slot-${currentSlot}`);
              if (slot) {
                slot.innerHTML = piece.icon;
                slot.classList.remove('border-dashed');
                slot.classList.add('bg-amber-100', 'border-amber-400');
              }
              renderPieces();

              if (placed.length === pieces.length && submitCb) {
                submitCb({ correct: true });
              }
            } else {
              btn.classList.add('border-rose-400');
              setTimeout(() => btn.classList.remove('border-rose-400'), 400);
              if (submitCb) submitCb({ correct: false });
            }
          });
        }
        piecesRow.appendChild(btn);
      });
    }

    renderPieces();

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
      type: 'success',
      message: lang === 'mr' ? 'शाब्बास! संपूर्ण कोडे पूर्ण झाले! 🌟' : 'Awesome puzzle solver! 🌟',
    };
  },
};

export default PicturePuzzle;

