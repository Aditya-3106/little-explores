/**
 * @file progress-report.js
 * @description Parent-facing learning progress dashboard and offline home activity suggestions.
 * Follows reporting principles: non-competitive, no misleading percentages, separates hinted attempts.
 * @module parent/progress-report
 */

import { createElement, onTouch } from '../utils/dom.js';
import { db } from '../storage/database.js';
import { OFFLINE_ACTIVITIES } from '../learning/recommendations.js';

export async function renderProgressReport(container, childId = 'default_child') {
  const progress = await db.progress.getProgress(childId);
  const history = await db.progress.getActivityHistory(childId, 15);

  const completedCount = progress.completedActivities?.length || 0;
  const domains = progress.domainsExplored || {};
  const skills = progress.skillsPracticed || {};

  container.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Title -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200">
        <h1 class="text-2xl font-black text-gray-900 mb-1">Learning Progress Summary</h1>
        <p class="text-xs text-gray-500">Holistic observation of your child's exploration, curiosity, and practiced skills.</p>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <span class="text-xs font-bold text-gray-400 uppercase">Activities Completed</span>
          <div class="text-3xl font-black text-blue-600 mt-1">${completedCount}</div>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs">
          <span class="text-xs font-bold text-gray-400 uppercase">Domains Explored</span>
          <div class="text-3xl font-black text-emerald-600 mt-1">${Object.keys(domains).length}</div>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs col-span-2 sm:col-span-1">
          <span class="text-xs font-bold text-gray-400 uppercase">Skills Practiced</span>
          <div class="text-3xl font-black text-purple-600 mt-1">${Object.keys(skills).length}</div>
        </div>
      </div>

      <!-- Domain Distribution -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <h2 class="text-base font-bold text-gray-900 mb-4">Domains Explored</h2>
        <div class="space-y-3">
          ${
            Object.keys(domains).length === 0
              ? `<p class="text-gray-400 text-sm">No activity history yet.</p>`
              : Object.entries(domains)
                  .map(([dom, count]) => {
                    const widthPct = Math.min(100, count * 20);
                    return `
                <div>
                  <div class="flex justify-between text-xs font-bold mb-1">
                    <span class="uppercase text-gray-700">${dom}</span>
                    <span class="text-gray-500">${count} sessions</span>
                  </div>
                  <div class="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div class="bg-blue-600 h-full rounded-full" style="width: ${widthPct}%"></div>
                  </div>
                </div>
              `;
                  })
                  .join('')
          }
        </div>
      </div>

      <!-- Real World Offline Activity Suggestions -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200 shadow-xs">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-3xl">🏡</span>
          <div>
            <h2 class="text-base font-bold text-amber-950">Recommended Real-World Play (Offline)</h2>
            <p class="text-xs text-amber-800">Support your child's screen-time balance with fun physical challenges.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          ${OFFLINE_ACTIVITIES.slice(0, 4)
            .map(
              (act) => `
            <div class="p-3 bg-white/80 rounded-xl border border-amber-200 text-xs font-medium text-amber-950">
              <span class="font-bold text-amber-700 uppercase block mb-1">${act.domain}</span>
              ${act.en}
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Recent History Log -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <h2 class="text-base font-bold text-gray-900 mb-4">Recent Activity History</h2>
        <div class="divide-y divide-gray-100 text-xs">
          ${
            history.length === 0
              ? `<p class="text-gray-400 py-3">No activity logs recorded yet.</p>`
              : history
                  .map(
                    (h) => `
                <div class="py-2.5 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span>${h.correct ? '✅' : '🔄'}</span>
                    <span class="font-bold text-gray-800">${h.activityId}</span>
                    <span class="text-gray-400">(${h.domain || 'general'})</span>
                  </div>
                  <div class="text-gray-500">
                    ${new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              `
                  )
                  .join('')
          }
        </div>
      </div>
    </div>
  `;
}

