/**
 * @file progression.js
 * @description Educational progression tracker based on NCF-FS 2022 principles.
 * @module learning/progression
 */

export const LearningStates = {
  NOT_INTRODUCED: 'not_introduced',
  EXPLORING: 'exploring',
  PRACTISING: 'practising',
  APPLYING: 'applying',
  REVISITING: 'revisiting',
};

/**
 * Determine a child's learning state for an objective given their history.
 * @param {Array<{correct: boolean, hintsUsed: number}>} attempts
 * @returns {string} One of LearningStates
 */
export function calculateLearningState(attempts) {
  if (!attempts || attempts.length === 0) return LearningStates.NOT_INTRODUCED;

  const total = attempts.length;
  const recent = attempts.slice(-3);
  const recentCorrectNoHints = recent.filter((a) => a.correct && a.hintsUsed === 0).length;

  if (recentCorrectNoHints >= 2) {
    return LearningStates.APPLYING;
  }
  if (total >= 4) {
    return LearningStates.PRACTISING;
  }
  return LearningStates.EXPLORING;
}

/**
 * Check if the child might benefit from an easier representation or hint.
 * @param {Array<{correct: boolean}>} recentAttempts
 * @returns {boolean}
 */
export function shouldSimplify(recentAttempts) {
  if (!recentAttempts || recentAttempts.length < 2) return false;
  const lastTwo = recentAttempts.slice(-2);
  return lastTwo.every((a) => !a.correct);
}

