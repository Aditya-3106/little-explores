/**
 * @module ActivityEngine
 * @description The main engine that loads, runs, and manages activity sessions
 * for the Little Explorers platform. Coordinates between the registry, validator,
 * and individual activity type implementations.
 * @version 1.0.0
 */

import { getActivityType, isRegistered } from './activity-registry.js';
import { validateActivity } from './activity-validator.js';

/**
 * Simple event emitter for activity lifecycle events.
 */
class ActivityEventEmitter {
  constructor() {
    /** @type {Object<string, Function[]>} */
    this._listeners = {};
  }

  /**
   * Subscribe to an event.
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event.
   * @param {string} event - Event name
   * @param {Function} callback - Event handler to remove
   */
  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(fn => fn !== callback);
  }

  /**
   * Emit an event.
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (!this._listeners[event]) return;
    for (const callback of this._listeners[event]) {
      try {
        callback(data);
      } catch (err) {
        console.error(`[ActivityEngine] Error in "${event}" listener:`, err);
      }
    }
  }

  /** Remove all listeners. */
  removeAllListeners() {
    this._listeners = {};
  }
}

/**
 * Represents an active activity session with state tracking and lifecycle management.
 */
class ActivitySession {
  /**
   * @param {Object} activityData - The activity data
   * @param {Object} template - The activity type template from registry
   * @param {HTMLElement} container - The DOM container
   * @param {Object} options - Session options
   */
  constructor(activityData, template, container, options = {}) {
    /** @type {Object} The activity data */
    this.activityData = activityData;

    /** @type {string} The template type identifier */
    this.templateType = template.type;

    /** @type {Object} Reference to the activity type template */
    this._template = template;

    /** @type {HTMLElement} The container element */
    this._container = container;

    /** @type {Object} Session options */
    this._options = options;

    /** @type {number} Session start timestamp */
    this.startTime = Date.now();

    /** @type {number} Number of submission attempts */
    this.attempts = 0;

    /** @type {number} Number of hints used */
    this.hintsUsed = 0;

    /** @type {boolean} Whether the activity is completed */
    this.completed = false;

    /** @type {Object|null} The last evaluation result */
    this._lastResult = null;

    /** @type {Object|null} The renderer interface returned by template.render() */
    this._renderer = null;

    /** @type {string} Current language */
    this._lang = options.lang || 'en';

    /** @type {number} Maximum allowed attempts (0 = unlimited) */
    this._maxAttempts = options.maxAttempts || 3;

    /** @type {number} Maximum available hints */
    this._maxHints = options.maxHints || 3;

    /** @type {Object[]} History of all responses */
    this._responseHistory = [];

    /** @type {ActivityEventEmitter} Event emitter */
    this._emitter = new ActivityEventEmitter();

    /** @type {boolean} Whether this session is destroyed */
    this._destroyed = false;
  }

  /**
   * Subscribe to session events.
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    return this._emitter.on(event, callback);
  }

  /**
   * Initialize and render the activity.
   * @returns {ActivitySession} this
   */
  _start() {
    try {
      this._renderer = this._template.render(
        this.activityData,
        this._container,
        {
          lang: this._lang,
          onSubmit: (response) => this.submitResponse(response),
          onHint: () => this.getHint()
        }
      );
      this._emitter.emit('activity:started', {
        type: this.templateType,
        activityId: this.activityData.id,
        startTime: this.startTime
      });
    } catch (err) {
      this._emitter.emit('activity:error', {
        type: this.templateType,
        error: err.message,
        phase: 'render'
      });
      throw err;
    }
    return this;
  }

  /**
   * Submit a response for evaluation.
   * @param {*} response - The child's response
   * @returns {Object} Evaluation result with feedback
   */
  submitResponse(response) {
    if (this._destroyed) {
      throw new Error('Session has been destroyed');
    }

    if (this.completed) {
      return this._lastResult;
    }

    this.attempts++;

    try {
      // Evaluate the response
      const evaluation = this._template.evaluate(this.activityData, response);

      // Get feedback
      const feedback = this._template.getFeedback(
        this.activityData,
        { ...evaluation, response },
        this._lang
      );

      const result = {
        ...evaluation,
        feedback,
        attempt: this.attempts,
        hintsUsed: this.hintsUsed,
        timeSpent: Date.now() - this.startTime
      };

      this._lastResult = result;
      this._responseHistory.push({
        response,
        result,
        timestamp: Date.now()
      });

      this._emitter.emit('activity:responded', {
        type: this.templateType,
        activityId: this.activityData.id,
        result
      });

      // Auto-complete on correct answer or max attempts
      if (evaluation.correct || (this._maxAttempts > 0 && this.attempts >= this._maxAttempts)) {
        this.complete();
      }

      return result;
    } catch (err) {
      this._emitter.emit('activity:error', {
        type: this.templateType,
        error: err.message,
        phase: 'evaluate'
      });
      throw err;
    }
  }

  /**
   * Get the next hint for the activity.
   * @returns {Object|null} Hint object or null if no hints available
   */
  getHint() {
    if (this._destroyed || this.completed) return null;

    if (this.hintsUsed >= this._maxHints) {
      return {
        message: this._lang === 'mr' ? 'आणखी संकेत उपलब्ध नाहीत!' : 'No more hints available!',
        type: 'info'
      };
    }

    this.hintsUsed++;

    // Generate hint based on activity type and hint level
    const hint = this._generateHint(this.hintsUsed);

    this._emitter.emit('activity:hintUsed', {
      type: this.templateType,
      activityId: this.activityData.id,
      hintNumber: this.hintsUsed
    });

    return hint;
  }

  /**
   * Generate a hint based on the current level.
   * @param {number} level - Hint level (1-based)
   * @returns {Object} Hint object
   * @private
   */
  _generateHint(level) {
    const activity = this.activityData;
    const payload = activity.payload || {};

    // Generic hints by level
    const genericHints = {
      en: [
        'Look carefully at all the options! 👀',
        'Try thinking about what you learned! 🤔',
        'You\'re so close! Look one more time! ⭐'
      ],
      mr: [
        'सर्व पर्याय नीट बघा! 👀',
        'तुम्ही जे शिकलात त्याबद्दल विचार करा! 🤔',
        'तुम्ही खूप जवळ आहात! आणखी एकदा बघा! ⭐'
      ]
    };

    const lang = this._lang;
    const hints = genericHints[lang] || genericHints.en;
    const hintIndex = Math.min(level - 1, hints.length - 1);

    return {
      message: hints[hintIndex],
      type: 'hint',
      level
    };
  }

  /**
   * Retry the activity (reset for another attempt without full reload).
   */
  retry() {
    if (this._destroyed) {
      throw new Error('Session has been destroyed');
    }

    this.completed = false;
    this._lastResult = null;

    // Re-render
    this._container.innerHTML = '';
    this._start();
  }

  /**
   * Mark the activity as complete.
   */
  complete() {
    if (this.completed) return;

    this.completed = true;

    this._emitter.emit('activity:completed', {
      type: this.templateType,
      activityId: this.activityData.id,
      result: this.getResult()
    });
  }

  /**
   * Get the full result object for this session.
   * @returns {Object} Activity result
   */
  getResult() {
    const timeSpent = Date.now() - this.startTime;

    return {
      activityId: this.activityData.id,
      templateType: this.templateType,
      completed: this.completed,
      correct: this._lastResult ? this._lastResult.correct : false,
      score: this._lastResult ? this._lastResult.score : 0,
      attempts: this.attempts,
      hintsUsed: this.hintsUsed,
      timeSpent,
      startTime: this.startTime,
      endTime: this.completed ? Date.now() : null,
      responseHistory: this._responseHistory.map(r => ({
        response: r.response,
        correct: r.result.correct,
        score: r.result.score,
        timestamp: r.timestamp
      }))
    };
  }

  /**
   * Clean up the session and release resources.
   */
  destroy() {
    if (this._destroyed) return;

    this._destroyed = true;

    // Destroy the renderer if it has a destroy method
    if (this._renderer && typeof this._renderer.destroy === 'function') {
      try {
        this._renderer.destroy();
      } catch (err) {
        console.error('[ActivitySession] Error destroying renderer:', err);
      }
    }

    // Clear the container
    if (this._container) {
      this._container.innerHTML = '';
    }

    // Remove all event listeners
    this._emitter.removeAllListeners();

    this._renderer = null;
    this._container = null;
    this._template = null;
  }
}

/**
 * The main Activity Engine - loads, validates, and runs activities.
 */
const ActivityEngine = {
  /** @type {ActivityEventEmitter} Global event emitter */
  _emitter: new ActivityEventEmitter(),

  /** @type {Map<string, ActivitySession>} Active sessions */
  _activeSessions: new Map(),

  /**
   * Subscribe to engine-level events.
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    return this._emitter.on(event, callback);
  },

  /**
   * Load and validate activity data without rendering.
   * @param {Object} activityData - The activity data object
   * @returns {Object} Validated and enriched activity data
   * @throws {Error} If activity data is invalid or template not found
   */
  loadActivity(activityData) {
    if (!activityData || !activityData.type) {
      throw new Error('Activity data must have a "type" field');
    }

    // Check if template is registered
    if (!isRegistered(activityData.type)) {
      throw new Error(`Unknown activity type: "${activityData.type}". Is it registered?`);
    }

    const template = getActivityType(activityData.type);

    // Version compatibility check
    if (activityData.templateVersion && activityData.templateVersion > template.version) {
      throw new Error(
        `Activity requires template version ${activityData.templateVersion} ` +
        `but registered version is ${template.version} for type "${activityData.type}"`
      );
    }

    // Validate the activity data
    const validation = validateActivity(activityData);
    if (!validation.valid) {
      throw new Error(
        `Invalid activity data for type "${activityData.type}": ${validation.errors.join('; ')}`
      );
    }

    // Ensure ID exists
    if (!activityData.id) {
      activityData.id = `act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    return activityData;
  },

  /**
   * Start an activity - validate, render, and create a session.
   * @param {Object} activityData - The activity data
   * @param {HTMLElement} container - DOM container to render into
   * @param {Object} [options] - Options (lang, maxAttempts, maxHints)
   * @returns {ActivitySession} The activity session
   */
  startActivity(activityData, container, options = {}) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('A valid DOM container element is required');
    }

    // Load and validate
    const validatedData = this.loadActivity(activityData);
    const template = getActivityType(validatedData.type);

    // Clear container
    container.innerHTML = '';

    // Create session
    const session = new ActivitySession(validatedData, template, container, options);

    // Relay session events to engine
    const sessionEvents = ['activity:started', 'activity:responded', 'activity:hintUsed', 'activity:completed', 'activity:error'];
    for (const event of sessionEvents) {
      session.on(event, (data) => this._emitter.emit(event, data));
    }

    // Store session
    this._activeSessions.set(validatedData.id, session);

    // Start the session (renders the activity)
    session._start();

    return session;
  },

  /**
   * Get an active session by activity ID.
   * @param {string} activityId - The activity ID
   * @returns {ActivitySession|null} The session or null
   */
  getSession(activityId) {
    return this._activeSessions.get(activityId) || null;
  },

  /**
   * Destroy a session and remove it from active sessions.
   * @param {string} activityId - The activity ID
   */
  destroySession(activityId) {
    const session = this._activeSessions.get(activityId);
    if (session) {
      session.destroy();
      this._activeSessions.delete(activityId);
    }
  },

  /**
   * Destroy all active sessions.
   */
  destroyAllSessions() {
    for (const [id, session] of this._activeSessions) {
      session.destroy();
    }
    this._activeSessions.clear();
  },

  /**
   * Get the count of active sessions.
   * @returns {number}
   */
  getActiveSessionCount() {
    return this._activeSessions.size;
  }
};

export { ActivitySession };
export default ActivityEngine;
