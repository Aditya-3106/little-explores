/**
 * @file state.js
 * @description Reactive state management store for Little Explorers.
 *   Provides dot-notation path access, subscriptions, and automatic
 *   change notifications.
 * @module core/state
 */

import { eventBus, APP_EVENTS } from './events.js';

// ─── Default State Shape ─────────────────────────────────────────────────────

/**
 * Returns a fresh copy of the initial application state.
 *
 * @returns {Object} Default state tree.
 */
function createDefaultState() {
  return {
    /** @type {Object|null} Current user / parent info */
    currentUser: null,

    /** @type {string} Active language code ('en' | 'mr') */
    currentLanguage: 'en',

    /** @type {string} Current route path */
    currentRoute: '/',

    /** @type {Object|null} Currently-selected child profile */
    childProfile: null,

    /** @type {Object|null} Active parent session (PIN-gated) */
    parentSession: null,

    /** @type {Object|null} Activity being played right now */
    activeActivity: null,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Resolve a dot-notation path to a value inside an object tree.
 *
 * @param {Object} obj  - Root object.
 * @param {string} path - Dot-notation path, e.g. `'childProfile.name'`.
 * @returns {*} The resolved value, or `undefined` when not found.
 */
function getByPath(obj, path) {
  if (!path) return obj;
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined;
    current = current[key];
  }
  return current;
}

/**
 * Set a value at a dot-notation path, creating intermediate objects as needed.
 *
 * @param {Object} obj   - Root object (mutated in place).
 * @param {string} path  - Dot-notation path.
 * @param {*}      value - Value to set.
 */
function setByPath(obj, path, value) {
  if (!path) return;
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] == null || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

/**
 * Deep-clone a value (JSON round-trip — suitable for plain data).
 *
 * @param {*} value
 * @returns {*}
 */
function deepClone(value) {
  if (value === undefined) return undefined;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

// ─── StateStore Class ────────────────────────────────────────────────────────

/**
 * Simple reactive state store.
 *
 * @example
 *   import { store } from './state.js';
 *   store.subscribe('currentLanguage', (lang) => console.log('Language →', lang));
 *   store.setState('currentLanguage', 'mr');
 */
class StateStore {
  constructor() {
    /** @private @type {Object} */
    this._state = createDefaultState();

    /**
     * Map of path → Set of subscriber callbacks.
     * A wildcard path `'*'` receives notifications for every change.
     * @private
     * @type {Map<string, Set<Function>>}
     */
    this._subscribers = new Map();
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  /**
   * Get a value from the state tree.
   *
   * @param {string} [path] - Dot-notation path. Omit to get the whole state.
   * @returns {*} A **deep clone** of the value (prevents external mutation).
   */
  getState(path) {
    const value = path ? getByPath(this._state, path) : this._state;
    return deepClone(value);
  }

  // ── Write ─────────────────────────────────────────────────────────────────

  /**
   * Set a value in the state tree and notify subscribers.
   *
   * @param {string} path  - Dot-notation path.
   * @param {*}      value - New value.
   * @returns {void}
   */
  setState(path, value) {
    if (typeof path !== 'string' || !path) {
      throw new Error('StateStore.setState(): path must be a non-empty string.');
    }

    const oldValue = getByPath(this._state, path);
    setByPath(this._state, path, value);
    const newValue = getByPath(this._state, path);

    // Notify exact-path subscribers
    this._notify(path, newValue, oldValue);

    // Notify parent-path subscribers (e.g. 'childProfile' when 'childProfile.name' changes)
    const parts = path.split('.');
    for (let i = parts.length - 1; i > 0; i--) {
      const parentPath = parts.slice(0, i).join('.');
      this._notify(parentPath, getByPath(this._state, parentPath), undefined);
    }

    // Notify wildcard subscribers
    this._notify('*', { path, value: newValue, oldValue });
  }

  // ── Subscribe ─────────────────────────────────────────────────────────────

  /**
   * Watch for changes at a given state path.
   *
   * @param {string}   path     - Dot-notation path, or `'*'` for all changes.
   * @param {Function} callback - Invoked with `(newValue, oldValue)`.
   * @returns {Function} Unsubscribe function.
   */
  subscribe(path, callback) {
    if (typeof path !== 'string' || !path) {
      throw new Error('StateStore.subscribe(): path must be a non-empty string.');
    }
    if (typeof callback !== 'function') {
      throw new Error('StateStore.subscribe(): callback must be a function.');
    }

    if (!this._subscribers.has(path)) {
      this._subscribers.set(path, new Set());
    }
    this._subscribers.get(path).add(callback);

    // Return an unsubscribe handle for convenience
    return () => this.unsubscribe(path, callback);
  }

  // ── Unsubscribe ───────────────────────────────────────────────────────────

  /**
   * Remove a subscriber.
   *
   * @param {string}   path     - The path the callback was registered on.
   * @param {Function} callback - The exact function reference.
   * @returns {boolean} `true` if the callback was found and removed.
   */
  unsubscribe(path, callback) {
    const subs = this._subscribers.get(path);
    if (!subs) return false;
    return subs.delete(callback);
  }

  // ── Reset ─────────────────────────────────────────────────────────────────

  /**
   * Reset the store to its initial default state. Useful for testing.
   *
   * @returns {void}
   */
  resetState() {
    this._state = createDefaultState();
    this._subscribers.clear();
  }

  // ── Private ───────────────────────────────────────────────────────────────

  /**
   * Notify all subscribers for a specific path.
   *
   * @private
   * @param {string} path
   * @param {*} newValue
   * @param {*} oldValue
   */
  _notify(path, newValue, oldValue) {
    const subs = this._subscribers.get(path);
    if (!subs || subs.size === 0) return;

    for (const callback of [...subs]) {
      try {
        callback(deepClone(newValue), deepClone(oldValue));
      } catch (err) {
        console.error(`[StateStore] Error in subscriber for "${path}":`, err);
      }
    }
  }
}

// ─── Singleton ───────────────────────────────────────────────────────────────

/** @type {StateStore} Shared application state store */
export const store = new StateStore();

export default store;
