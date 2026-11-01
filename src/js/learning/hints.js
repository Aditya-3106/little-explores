/**
 * @file hints.js
 * @description Multi-tiered progressive hint manager.
 * @module learning/hints
 */

export class HintManager {
  /**
   * Get the appropriate hint text for the current attempt.
   * @param {Object} activity
   * @param {number} attemptCount
   * @param {'en'|'mr'} [lang='en']
   * @returns {string|null}
   */
  static getHint(activity, attemptCount, lang = 'en') {
    if (!activity || !activity.locales) return null;
    const loc = activity.locales[lang] || activity.locales.en || {};

    if (attemptCount === 1) {
      return loc.hint || loc.firstHint || 'Look carefully at the choices!';
    } else if (attemptCount >= 2) {
      return loc.secondHint || loc.hint || 'Take your time, you can do it!';
    }
    return null;
  }

  /**
   * Determine if an automatic hint button should glow or highlight.
   * @param {number} attemptCount
   * @returns {boolean}
   */
  static shouldHighlightHint(attemptCount) {
    return attemptCount >= 2;
  }
}

