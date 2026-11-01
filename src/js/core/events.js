/**
 * @file events.js
 * @description Application-wide event bus for Little Explorers.
 *   Supports namespaced events, one-time listeners, and standard event constants.
 * @module core/events
 */

// ─── Standard Application Events ─────────────────────────────────────────────

/** @constant {Object<string, string>} Canonical event names used across the app */
export const APP_EVENTS = {
  // Language
  LANGUAGE_CHANGED: 'language:changed',

  // Routing
  ROUTE_BEFORE_CHANGE: 'route:beforeChange',
  ROUTE_CHANGED: 'route:changed',
  ROUTE_NOT_FOUND: 'route:notFound',

  // Activity lifecycle
  ACTIVITY_LOADED: 'activity:loaded',
  ACTIVITY_STARTED: 'activity:started',
  ACTIVITY_PAUSED: 'activity:paused',
  ACTIVITY_RESUMED: 'activity:resumed',
  ACTIVITY_COMPLETED: 'activity:completed',
  ACTIVITY_EXITED: 'activity:exited',

  // Question builder
  QUESTION_CREATED: 'question:created',
  QUESTION_UPDATED: 'question:updated',
  QUESTION_DELETED: 'question:deleted',
  QUESTION_PUBLISHED: 'question:published',

  // Child interaction
  CHILD_ANSWER: 'child:answer',
  CHILD_HINT_REQUEST: 'child:hintRequest',
  CHILD_CORRECT: 'child:correct',
  CHILD_INCORRECT: 'child:incorrect',

  // Progress
  PROGRESS_UPDATED: 'progress:updated',
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',

  // Parent area
  PARENT_LOGIN: 'parent:login',
  PARENT_LOGOUT: 'parent:logout',
  PARENT_QUESTION_SAVED: 'parent:questionSaved',

  // Media
  AUDIO_PLAY: 'audio:play',
  AUDIO_STOP: 'audio:stop',

  // Data
  DATA_IMPORTED: 'data:imported',
  DATA_EXPORTED: 'data:exported',
  SYNC_STARTED: 'sync:started',
  SYNC_COMPLETED: 'sync:completed',
  SYNC_ERROR: 'sync:error',

  // UI
  MODAL_OPEN: 'ui:modalOpen',
  MODAL_CLOSE: 'ui:modalClose',
  TOAST_SHOW: 'ui:toastShow',

  // App lifecycle
  APP_READY: 'app:ready',
  APP_ERROR: 'app:error',
  OFFLINE: 'app:offline',
  ONLINE: 'app:online',
};

// ─── EventBus Class ──────────────────────────────────────────────────────────

/**
 * Lightweight publish / subscribe event bus.
 *
 * @example
 *   import { eventBus, APP_EVENTS } from './events.js';
 *   eventBus.on(APP_EVENTS.ACTIVITY_STARTED, (data) => console.log(data));
 *   eventBus.emit(APP_EVENTS.ACTIVITY_STARTED, { activityId: '123' });
 */
class EventBus {
  constructor() {
    /**
     * Map of event name → Set of handler functions.
     * @private
     * @type {Map<string, Set<Function>>}
     */
    this._listeners = new Map();

    /**
     * Set of one-time handler wrappers so we can remove them after invocation.
     * @private
     * @type {Map<Function, Function>}
     */
    this._onceWrappers = new Map();
  }

  // ── Subscribe ─────────────────────────────────────────────────────────────

  /**
   * Register a handler for an event.
   *
   * @param {string} event - Event name (supports namespaces like `'activity:started'`).
   * @param {Function} handler - Callback invoked with `(data)`.
   * @returns {void}
   */
  on(event, handler) {
    if (typeof event !== 'string' || !event) {
      throw new Error('EventBus.on(): event must be a non-empty string.');
    }
    if (typeof handler !== 'function') {
      throw new Error('EventBus.on(): handler must be a function.');
    }

    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(handler);
  }

  // ── Unsubscribe ───────────────────────────────────────────────────────────

  /**
   * Remove a previously registered handler.
   *
   * @param {string} event - Event name.
   * @param {Function} handler - The exact function reference passed to `on()` or `once()`.
   * @returns {boolean} `true` if the handler was found and removed.
   */
  off(event, handler) {
    if (typeof event !== 'string' || !event) return false;
    if (typeof handler !== 'function') return false;

    const handlers = this._listeners.get(event);
    if (!handlers) return false;

    // If the handler was registered via once(), remove the wrapper instead.
    const wrapper = this._onceWrappers.get(handler);
    if (wrapper) {
      this._onceWrappers.delete(handler);
      return handlers.delete(wrapper);
    }

    return handlers.delete(handler);
  }

  // ── One-time Subscribe ────────────────────────────────────────────────────

  /**
   * Register a handler that is automatically removed after its first invocation.
   *
   * @param {string} event - Event name.
   * @param {Function} handler - Callback invoked with `(data)`.
   * @returns {void}
   */
  once(event, handler) {
    if (typeof handler !== 'function') {
      throw new Error('EventBus.once(): handler must be a function.');
    }

    /** @type {Function} */
    const wrapper = (data) => {
      this.off(event, handler);
      handler(data);
    };

    this._onceWrappers.set(handler, wrapper);
    this.on(event, wrapper);
  }

  // ── Emit ──────────────────────────────────────────────────────────────────

  /**
   * Emit an event, invoking all registered handlers synchronously.
   *
   * @param {string} event - Event name.
   * @param {*} [data] - Optional payload passed to every handler.
   * @returns {void}
   */
  emit(event, data) {
    if (typeof event !== 'string' || !event) return;

    const handlers = this._listeners.get(event);
    if (!handlers || handlers.size === 0) return;

    // Iterate over a snapshot so handlers may safely add/remove listeners.
    for (const handler of [...handlers]) {
      try {
        handler(data);
      } catch (err) {
        console.error(`[EventBus] Error in handler for "${event}":`, err);
      }
    }
  }

  // ── Utility ───────────────────────────────────────────────────────────────

  /**
   * Check whether an event has any listeners.
   *
   * @param {string} event
   * @returns {boolean}
   */
  hasListeners(event) {
    const handlers = this._listeners.get(event);
    return handlers ? handlers.size > 0 : false;
  }

  /**
   * Return the number of listeners for an event.
   *
   * @param {string} event
   * @returns {number}
   */
  listenerCount(event) {
    const handlers = this._listeners.get(event);
    return handlers ? handlers.size : 0;
  }

  /**
   * Remove **all** listeners, optionally scoped to a single event.
   *
   * @param {string} [event] - If provided, only listeners for this event are removed.
   * @returns {void}
   */
  clear(event) {
    if (event) {
      this._listeners.delete(event);
    } else {
      this._listeners.clear();
      this._onceWrappers = new Map();
    }
  }
}

// ─── Singleton ───────────────────────────────────────────────────────────────

/** @type {EventBus} Shared event bus instance for the entire application */
export const eventBus = new EventBus();

export default eventBus;
