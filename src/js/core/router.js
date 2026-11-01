/**
 * @file router.js
 * @description Simple hash-based SPA router for Little Explorers.
 *   Supports route parameters, guards, before/after hooks, and 404 handling.
 * @module core/router
 */

import { eventBus, APP_EVENTS } from './events.js';
import { store } from './state.js';

// ─── Route Record ────────────────────────────────────────────────────────────

/**
 * @typedef {Object} RouteRecord
 * @property {string}   path     - Route pattern, e.g. `'/world/:worldId'`.
 * @property {Function} handler  - `(params, query) => void` invoked when the route matches.
 * @property {Function} [guard]  - Optional async guard; return `true` to allow, `false` to block.
 * @property {string}   [name]   - Optional human-readable name for the route.
 */

// ─── Router Class ────────────────────────────────────────────────────────────

/**
 * Lightweight hash-based router.
 *
 * @example
 *   import { router } from './router.js';
 *
 *   router.register('/play/world/:worldId', (params) => {
 *     console.log('World:', params.worldId);
 *   });
 *
 *   router.navigate('/play/world/letter-land');
 */
class Router {
  constructor() {
    /** @private @type {RouteRecord[]} */
    this._routes = [];

    /** @private @type {Function|null} Fallback handler for unmatched routes */
    this._notFoundHandler = null;

    /** @private @type {Function[]} Called before every navigation */
    this._beforeHooks = [];

    /** @private @type {Function[]} Called after every navigation */
    this._afterHooks = [];

    /** @private @type {{ path: string, params: Object, query: Object }|null} */
    this._currentRoute = null;

    /** @private @type {boolean} */
    this._listening = false;

    // Bind so we can safely add/remove as event listener
    this._onHashChange = this._onHashChange.bind(this);
  }

  // ── Registration ──────────────────────────────────────────────────────────

  /**
   * Register a route.
   *
   * @param {string}        path    - Path pattern (e.g. `'/world/:worldId'`).
   * @param {Function}      handler - Route handler `(params, query) => void`.
   * @param {Object}        [opts]
   * @param {Function}      [opts.guard] - Async guard `() => Promise<boolean>`.
   * @param {string}        [opts.name]  - Human-readable route name.
   * @returns {Router} `this` for chaining.
   */
  register(path, handler, opts = {}) {
    if (typeof path !== 'string' || !path) {
      throw new Error('Router.register(): path must be a non-empty string.');
    }
    if (typeof handler !== 'function') {
      throw new Error('Router.register(): handler must be a function.');
    }

    this._routes.push({
      path,
      handler,
      guard: opts.guard || null,
      name: opts.name || path,
      _regex: this._pathToRegex(path),
      _paramNames: this._extractParamNames(path),
    });

    return this;
  }

  /**
   * Set the handler for unmatched routes (404).
   *
   * @param {Function} handler - `(path) => void`
   * @returns {Router}
   */
  setNotFound(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Router.setNotFound(): handler must be a function.');
    }
    this._notFoundHandler = handler;
    return this;
  }

  // ── Hooks ─────────────────────────────────────────────────────────────────

  /**
   * Add a before-navigation hook.  Return `false` from the hook to cancel navigation.
   *
   * @param {Function} hook - `(to, from) => boolean | Promise<boolean>`
   * @returns {Router}
   */
  beforeEach(hook) {
    if (typeof hook === 'function') this._beforeHooks.push(hook);
    return this;
  }

  /**
   * Add an after-navigation hook.
   *
   * @param {Function} hook - `(to, from) => void`
   * @returns {Router}
   */
  afterEach(hook) {
    if (typeof hook === 'function') this._afterHooks.push(hook);
    return this;
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  /**
   * Navigate to a path programmatically.
   *
   * @param {string} path - Target path (without `#`).
   * @returns {void}
   */
  navigate(path) {
    if (typeof path !== 'string') return;
    // Normalise: ensure leading slash, remove trailing slash (except root)
    if (!path.startsWith('/')) path = '/' + path;
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

    window.location.hash = '#' + path;
  }

  /**
   * Replace the current route without adding a history entry.
   *
   * @param {string} path
   * @returns {void}
   */
  replace(path) {
    if (typeof path !== 'string') return;
    if (!path.startsWith('/')) path = '/' + path;
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

    window.location.replace('#' + path);
  }

  /**
   * Go back one step in browser history.
   * @returns {void}
   */
  back() {
    window.history.back();
  }

  /**
   * Go forward one step in browser history.
   * @returns {void}
   */
  forward() {
    window.history.forward();
  }

  // ── Query ─────────────────────────────────────────────────────────────────

  /**
   * Get information about the current route.
   *
   * @returns {{ path: string, params: Object, query: Object, name: string|null }|null}
   */
  getCurrentRoute() {
    return this._currentRoute ? { ...this._currentRoute } : null;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /**
   * Start listening for hash changes and resolve the initial route.
   * @returns {void}
   */
  start() {
    if (this._listening) return;
    window.addEventListener('hashchange', this._onHashChange);
    this._listening = true;
    // Resolve whatever hash is already in the URL
    this._resolve();
  }

  /**
   * Stop listening for hash changes.
   * @returns {void}
   */
  stop() {
    window.removeEventListener('hashchange', this._onHashChange);
    this._listening = false;
  }

  // ── Private ───────────────────────────────────────────────────────────────

  /**
   * hashchange handler.
   * @private
   */
  _onHashChange() {
    this._resolve();
  }

  /**
   * Resolve the current hash to a registered route and invoke its handler.
   * @private
   * @returns {Promise<void>}
   */
  async _resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const [rawPath, rawQuery] = hash.split('?');
    const path = rawPath || '/';
    const query = this._parseQuery(rawQuery);

    const from = this._currentRoute;

    // Attempt to match a route
    for (const route of this._routes) {
      const params = this._match(route, path);
      if (params === null) continue;

      const to = { path, params, query, name: route.name };

      // ── Before hooks ──────────────────────────────────────────────────
      eventBus.emit(APP_EVENTS.ROUTE_BEFORE_CHANGE, { to, from });

      let allowed = true;
      for (const hook of this._beforeHooks) {
        try {
          const result = await hook(to, from);
          if (result === false) {
            allowed = false;
            break;
          }
        } catch (err) {
          console.error('[Router] beforeEach hook error:', err);
          allowed = false;
          break;
        }
      }
      if (!allowed) return;

      // ── Route guard ───────────────────────────────────────────────────
      if (typeof route.guard === 'function') {
        try {
          const guardResult = await route.guard(to, from);
          if (guardResult === false) return;
        } catch (err) {
          console.error('[Router] Route guard error:', err);
          return;
        }
      }

      // ── Invoke handler ────────────────────────────────────────────────
      this._currentRoute = to;
      store.setState('currentRoute', path);

      try {
        await route.handler(params, query);
      } catch (err) {
        console.error(`[Router] Handler error for "${path}":`, err);
      }

      // ── After hooks ───────────────────────────────────────────────────
      eventBus.emit(APP_EVENTS.ROUTE_CHANGED, { to, from });
      for (const hook of this._afterHooks) {
        try {
          hook(to, from);
        } catch (err) {
          console.error('[Router] afterEach hook error:', err);
        }
      }
      return;
    }

    // ── 404 ──────────────────────────────────────────────────────────────
    eventBus.emit(APP_EVENTS.ROUTE_NOT_FOUND, { path, query });
    if (this._notFoundHandler) {
      this._currentRoute = { path, params: {}, query, name: null };
      store.setState('currentRoute', path);
      try {
        this._notFoundHandler(path, query);
      } catch (err) {
        console.error('[Router] 404 handler error:', err);
      }
    } else {
      console.warn(`[Router] No route matches "${path}" and no 404 handler is set.`);
    }
  }

  /**
   * Test a route record against a path and extract parameters.
   *
   * @private
   * @param {Object} route
   * @param {string} path
   * @returns {Object|null} Extracted params, or `null` if no match.
   */
  _match(route, path) {
    const match = route._regex.exec(path);
    if (!match) return null;

    const params = {};
    route._paramNames.forEach((name, i) => {
      params[name] = decodeURIComponent(match[i + 1] || '');
    });
    return params;
  }

  /**
   * Convert a route pattern to a RegExp.
   *
   * @private
   * @param {string} path
   * @returns {RegExp}
   */
  _pathToRegex(path) {
    const pattern = path
      .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') // escape specials first
      .replace(/\\:(\w+)/g, '([^/]+)'); // replace `:param` placeholders
    return new RegExp(`^${pattern}$`);
  }

  /**
   * Extract parameter names from a pattern.
   *
   * @private
   * @param {string} path
   * @returns {string[]}
   */
  _extractParamNames(path) {
    const names = [];
    const re = /:(\w+)/g;
    let m;
    while ((m = re.exec(path)) !== null) {
      names.push(m[1]);
    }
    return names;
  }

  /**
   * Parse a query string into an object.
   *
   * @private
   * @param {string} [qs]
   * @returns {Object}
   */
  _parseQuery(qs) {
    if (!qs) return {};
    const params = {};
    for (const part of qs.split('&')) {
      const [key, val] = part.split('=');
      if (key) params[decodeURIComponent(key)] = val ? decodeURIComponent(val) : '';
    }
    return params;
  }
}

// ─── Singleton ───────────────────────────────────────────────────────────────

/** @type {Router} Shared application router */
export const router = new Router();

/**
 * Convenience navigate helper.
 * @param {string} path
 */
export function navigateTo(path) {
  router.navigate(path);
}

export default router;
