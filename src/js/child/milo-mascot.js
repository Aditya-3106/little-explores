/**
 * @file milo-mascot.js
 * @description Milo the mascot character with expressive inline SVG graphics and speech bubble.
 * @module child/milo-mascot
 */

import { createElement } from '../utils/dom.js';

/**
 * Returns inline SVG for Milo in different poses.
 * @param {'wave'|'happy'|'think'|'encourage'|'point'} expression
 * @param {number} [size=120]
 * @returns {string} SVG string
 */
export function getMiloSVG(expression = 'wave', size = 120) {
  // Friendly cartoon character: Little explorer fox/bear with an explorer cap and warm smile
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" class="select-none inline-block">
      <!-- Glow aura -->
      <circle cx="80" cy="85" r="70" fill="#FEF3C7" opacity="0.6"/>
      
      <!-- Body -->
      <ellipse cx="80" cy="115" rx="36" ry="32" fill="#F97316"/>
      <ellipse cx="80" cy="118" rx="22" ry="22" fill="#FED7AA"/>
      
      <!-- Backpack straps -->
      <path d="M60 95 L55 130" stroke="#78350F" stroke-width="4" stroke-linecap="round"/>
      <path d="M100 95 L105 130" stroke="#78350F" stroke-width="4" stroke-linecap="round"/>

      <!-- Arms -->
      ${
        expression === 'wave'
          ? `<path d="M46 108 C35 90 30 75 35 65 C40 60 48 70 52 95" fill="#EA580C"/>
             <circle cx="34" cy="62" r="8" fill="#FDBA74"/>`
          : expression === 'happy'
          ? `<path d="M46 105 C35 80 25 70 30 60 C38 58 48 75 52 95" fill="#EA580C"/>
             <path d="M114 105 C125 80 135 70 130 60 C122 58 112 75 108 95" fill="#EA580C"/>`
          : `<path d="M48 108 C40 115 35 125 45 130" stroke="#EA580C" stroke-width="8" stroke-linecap="round"/>
             <path d="M112 108 C120 115 125 125 115 130" stroke="#EA580C" stroke-width="8" stroke-linecap="round"/>`
      }

      <!-- Head -->
      <circle cx="80" cy="70" r="38" fill="#F97316"/>
      
      <!-- Cheeks & Snout -->
      <ellipse cx="80" cy="78" rx="18" ry="14" fill="#FED7AA"/>
      <circle cx="56" cy="76" r="6" fill="#FDBA74" opacity="0.8"/>
      <circle cx="104" cy="76" r="6" fill="#FDBA74" opacity="0.8"/>

      <!-- Nose -->
      <ellipse cx="80" cy="72" rx="5" ry="4" fill="#431407"/>

      <!-- Mouth -->
      <path d="M75 78 Q80 84 85 78" stroke="#431407" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Eyes -->
      <circle cx="68" cy="62" r="5" fill="#1E293B"/>
      <circle cx="70" cy="60" r="2" fill="#FFFFFF"/>
      <circle cx="92" cy="62" r="5" fill="#1E293B"/>
      <circle cx="94" cy="60" r="2" fill="#FFFFFF"/>

      <!-- Explorer Hat -->
      <path d="M50 48 Q80 34 110 48 L106 36 Q80 28 54 36 Z" fill="#D97706"/>
      <ellipse cx="80" cy="48" rx="42" ry="7" fill="#B45309"/>
      <!-- Compass Badge on Hat -->
      <circle cx="80" cy="40" r="5" fill="#FEF08A"/>
      <path d="M80 37 L82 40 L80 43 L78 40 Z" fill="#DC2626"/>

      <!-- Ears -->
      <path d="M48 48 L40 28 C46 26 56 32 58 44 Z" fill="#EA580C"/>
      <path d="M46 44 L42 32 C45 31 52 35 53 42 Z" fill="#FED7AA"/>
      <path d="M112 48 L120 28 C114 26 104 32 102 44 Z" fill="#EA580C"/>
      <path d="M114 44 L118 32 C115 31 108 35 107 42 Z" fill="#FED7AA"/>
    </svg>
  `;
}

/**
 * Render Milo with a speech bubble into a container.
 * @param {HTMLElement} container
 * @param {'wave'|'happy'|'think'|'encourage'} expression
 * @param {string} message
 */
export function renderMiloBubble(container, expression = 'wave', message = 'Hello Explorer!') {
  container.innerHTML = `
    <div class="milo-bubble-wrap flex items-center gap-4 max-w-xl mx-auto p-2">
      <div class="milo-avatar flex-shrink-0 animate-bounce-gentle">
        ${getMiloSVG(expression, 100)}
      </div>
      <div class="relative bg-white border-3 border-amber-300 rounded-3xl p-4 shadow-md text-amber-950 font-bold text-base md:text-lg flex-1">
        <div class="absolute -left-3 top-6 w-0 h-0 border-t-8 border-t-transparent border-r-12 border-r-amber-300 border-b-8 border-b-transparent"></div>
        <p>${message}</p>
      </div>
    </div>
  `;
}

