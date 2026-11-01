/**
 * @file game-session.js
 * @description Activity gameplay session manager connecting activity engine, audio, hints, and feedback.
 * @module child/game-session
 */

import { createElement, onTouch } from '../utils/dom.js';
import { db } from '../storage/database.js';
import { getActivityType } from '../activities/activity-registry.js';
import { playInstruction, speak } from '../utils/audio.js';
import { HintManager } from '../learning/hints.js';
import { showCorrectCelebration, showEncouragingHint, showCompletionScreen } from './feedback.js';
import { getOfflineRecommendation } from '../learning/recommendations.js';
import { navigateTo } from '../core/router.js';

export async function startGameSession(activityId, container) {
  const currentLang = window.currentLang || 'en';

  // 1. Fetch activity from DB
  const activity = await db.questions.getById(activityId);
  if (!activity) {
    container.innerHTML = `
      <div class="p-8 text-center max-w-md mx-auto">
        <h2 class="text-xl font-bold text-gray-800">Activity not found</h2>
        <button id="btn-err-back" class="mt-4 px-4 py-2 bg-amber-500 text-white font-bold rounded-xl">Back</button>
      </div>
    `;
    const btn = container.querySelector('#btn-err-back');
    if (btn) onTouch(btn, () => navigateTo('/play'));
    return;
  }

  // 2. Fetch activity type template
  const template = getActivityType(activity.activityType);
  if (!template) {
    container.innerHTML = `
      <div class="p-8 text-center max-w-md mx-auto">
        <h2 class="text-xl font-bold text-gray-800">Unsupported activity type: ${activity.activityType}</h2>
        <button id="btn-err-back" class="mt-4 px-4 py-2 bg-amber-500 text-white font-bold rounded-xl">Back</button>
      </div>
    `;
    const btn = container.querySelector('#btn-err-back');
    if (btn) onTouch(btn, () => navigateTo('/play'));
    return;
  }

  const loc = activity.locales?.[currentLang] || activity.locales?.en || {};
  const title = loc.title || activity.title || 'Learning Game';
  const instruction = loc.instruction || 'Follow the instructions to play!';

  let attempts = 0;
  let hintsUsed = 0;

  // 3. Render game screen layout
  container.innerHTML = `
    <div class="game-session max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <!-- Top Bar -->
      <div class="flex items-center justify-between bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
        <button id="gs-back" class="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 text-xl font-bold min-h-[44px] min-w-[44px]">
          ← Exit
        </button>
        <span class="font-black text-gray-800 text-lg truncate px-2">${title}</span>
        <div class="flex items-center gap-2">
          <button id="gs-audio" class="p-2 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200 text-xl font-bold min-h-[44px] min-w-[44px]" title="Play Audio">
            🔊
          </button>
          <button id="gs-hint" class="p-2 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 text-xl font-bold min-h-[44px] min-w-[44px]" title="Need a Hint?">
            💡
          </button>
        </div>
      </div>

      <!-- Spoken instruction bar -->
      <div class="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-3 flex items-center justify-between text-indigo-950 font-bold text-sm md:text-base">
        <span>${instruction}</span>
        <button id="gs-speak-text" class="text-xs bg-indigo-200 hover:bg-indigo-300 text-indigo-900 px-3 py-1.5 rounded-full font-bold ml-2 flex-shrink-0">
          Listen 📢
        </button>
      </div>

      <!-- Activity Workspace (rendered by template) -->
      <div id="gs-workspace" class="bg-white rounded-3xl p-4 md:p-6 shadow-md border-2 border-purple-100 min-h-[360px] flex items-center justify-center">
      </div>
    </div>
  `;

  const workspace = container.querySelector('#gs-workspace');

  // Hook up audio triggers
  const playCurrentInstruction = () => {
    if (loc.audio) {
      playInstruction(loc, currentLang);
    } else {
      speak(instruction, currentLang);
    }
  };

  const audioBtn = container.querySelector('#gs-audio');
  const speakBtn = container.querySelector('#gs-speak-text');
  if (audioBtn) onTouch(audioBtn, playCurrentInstruction);
  if (speakBtn) onTouch(speakBtn, playCurrentInstruction);

  // Hook up Hint button
  const hintBtn = container.querySelector('#gs-hint');
  if (hintBtn) {
    onTouch(hintBtn, () => {
      hintsUsed++;
      const hintText = HintManager.getHint(activity, hintsUsed, currentLang);
      showEncouragingHint(container, hintText);
      speak(hintText, currentLang);
    });
  }

  // Hook up back button
  const backBtn = container.querySelector('#gs-back');
  if (backBtn) {
    onTouch(backBtn, () => {
      navigateTo('/play');
    });
  }

  // Auto-play audio instruction once on start
  setTimeout(() => {
    playCurrentInstruction();
  }, 400);

  // 4. Render template activity
  const sessionInstance = template.render(activity, workspace, {
    language: currentLang,
  });

  if (sessionInstance && sessionInstance.onSubmit) {
    sessionInstance.onSubmit(async (response) => {
      attempts++;
      const evaluation = template.evaluate(activity, response);

      if (evaluation.correct) {
        // Record progress
        await db.progress.recordActivity('default_child', {
          activityId: activity.id,
          domain: activity.domain,
          learningObjective: activity.learningObjective,
          correct: true,
          attempts,
          hintsUsed,
        });

        // Show celebration
        const feedback = template.getFeedback(activity, response, currentLang);
        showCorrectCelebration(container, feedback.message);

        // Completion screen
        setTimeout(() => {
          showCompletionScreen(container, {
            title,
            learned: loc.learned || loc.instruction,
            offlineSuggestion: getOfflineRecommendation(activity.domain, currentLang),
            onTryAnother: () => {
              navigateTo('/play');
            },
            onBackWorld: () => {
              navigateTo(activity.worldId ? `/play/world/${activity.worldId}` : '/play');
            },
          });
        }, 1200);
      } else {
        // Encouraging retry
        const feedback = template.getFeedback(activity, response, currentLang);
        showEncouragingHint(container, feedback.message);

        // Record attempt
        await db.progress.recordActivity('default_child', {
          activityId: activity.id,
          domain: activity.domain,
          learningObjective: activity.learningObjective,
          correct: false,
          attempts,
          hintsUsed,
        });
      }
    });
  }
}

