/**
 * @file language-manager.js
 * @description Internationalisation (i18n) manager for Little Explorers.
 *   Handles language switching, nested-key translation, and interpolation.
 * @module i18n/language-manager
 */

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../core/config.js';
import { eventBus, APP_EVENTS } from '../core/events.js';
import { store } from '../core/state.js';

// ─── LanguageManager Class ───────────────────────────────────────────────────

/**
 * Manages translations and language selection.
 *
 * @example
 *   import { i18n } from './language-manager.js';
 *   i18n.loadTranslations('en', enTranslations);
 *   i18n.setLanguage('en');
 *   console.log(i18n.t('worlds.letterLand.name')); // "Letter Land"
 *   console.log(i18n.t('welcome', { name: 'Milo' })); // "Welcome, Milo!"
 */
class LanguageManager {
  constructor() {
    /**
     * Translation dictionaries keyed by language code.
     * @private
     * @type {Object<string, Object>}
     */
    this._translations = {};

    /**
     * Current active language code.
     * @private
     * @type {string}
     */
    this._currentLanguage = DEFAULT_LANGUAGE;
  }

  // ── Language Selection ────────────────────────────────────────────────────

  /**
   * Set the active language.
   *
   * @param {string} lang - Language code (must be in `SUPPORTED_LANGUAGES`).
   * @throws {Error} If the language code is unsupported.
   * @returns {void}
   */
  setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      throw new Error(
        `LanguageManager.setLanguage(): "${lang}" is not supported. ` +
          `Available: ${SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    const previous = this._currentLanguage;
    this._currentLanguage = lang;

    // Persist in state store
    store.setState('currentLanguage', lang);

    // Persist in localStorage for next visit
    try {
      localStorage.setItem('little-explorers-lang', lang);
    } catch {
      // localStorage may be unavailable (private mode, etc.)
    }

    if (previous !== lang) {
      eventBus.emit(APP_EVENTS.LANGUAGE_CHANGED, { language: lang, previous });
    }
  }

  /**
   * Get the active language code.
   *
   * @returns {string}
   */
  getLanguage() {
    return this._currentLanguage;
  }

  /**
   * Return the list of supported language codes.
   *
   * @returns {string[]}
   */
  getAvailableLanguages() {
    return [...SUPPORTED_LANGUAGES];
  }

  // ── Translations ──────────────────────────────────────────────────────────

  /**
   * Load (or merge) a translation dictionary for a language.
   *
   * @param {string} lang         - Language code.
   * @param {Object} translations - Flat or nested translation object.
   * @returns {void}
   */
  loadTranslations(lang, translations) {
    if (typeof lang !== 'string' || !lang) {
      throw new Error('LanguageManager.loadTranslations(): lang must be a non-empty string.');
    }
    if (!translations || typeof translations !== 'object') {
      throw new Error('LanguageManager.loadTranslations(): translations must be an object.');
    }

    // Deep-merge into existing translations (so multiple calls are additive)
    this._translations[lang] = this._deepMerge(
      this._translations[lang] || {},
      translations
    );
  }

  // ── Translate ─────────────────────────────────────────────────────────────

  /**
   * Translate a key, with optional parameter substitution.
   *
   * @param {string}  key       - Dot-separated key, e.g. `'worlds.letterLand.name'`.
   * @param {Object}  [params]  - Interpolation values, e.g. `{ name: 'Milo' }`.
   * @param {string}  [lang]    - Override language (defaults to current).
   * @returns {string} Translated string, or the key itself if not found.
   */
  t(key, params, lang) {
    const language = lang || this._currentLanguage;
    const dict = this._translations[language];

    if (!dict) {
      console.warn(`[i18n] No translations loaded for "${language}".`);
      return key;
    }

    let value = this._resolveKey(dict, key);

    // Fallback to default language if the key is missing
    if (value === undefined && language !== DEFAULT_LANGUAGE) {
      const fallback = this._translations[DEFAULT_LANGUAGE];
      if (fallback) {
        value = this._resolveKey(fallback, key);
      }
    }

    if (value === undefined) {
      console.warn(`[i18n] Missing key "${key}" for language "${language}".`);
      return key;
    }

    // Interpolate: replace `{param}` tokens
    if (params && typeof value === 'string') {
      value = value.replace(/\{(\w+)\}/g, (_, name) => {
        return params[name] !== undefined ? String(params[name]) : `{${name}}`;
      });
    }

    return value;
  }

  // ── Initialisation Helper ─────────────────────────────────────────────────

  /**
   * Initialise the language manager: try to restore the user's last-chosen
   * language from localStorage, falling back to `DEFAULT_LANGUAGE`.
   *
   * @returns {void}
   */
  init() {
    let saved = null;
    try {
      saved = localStorage.getItem('little-explorers-lang');
    } catch {
      // ignore
    }

    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      this._currentLanguage = saved;
    } else {
      this._currentLanguage = DEFAULT_LANGUAGE;
    }

    store.setState('currentLanguage', this._currentLanguage);
  }

  // ── Private Helpers ───────────────────────────────────────────────────────

  /**
   * Resolve a dot-notation key inside a nested object.
   *
   * @private
   * @param {Object} obj
   * @param {string} key
   * @returns {*}
   */
  _resolveKey(obj, key) {
    const parts = key.split('.');
    let current = obj;
    for (const part of parts) {
      if (current == null || typeof current !== 'object') return undefined;
      current = current[part];
    }
    return current;
  }

  /**
   * Deep-merge `source` into `target` (non-destructive to `target` properties
   * unless overridden by `source`).
   *
   * @private
   * @param {Object} target
   * @param {Object} source
   * @returns {Object}
   */
  _deepMerge(target, source) {
    const output = { ...target };
    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target[key] &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        output[key] = this._deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
  }
}

// ─── Singleton ───────────────────────────────────────────────────────────────

/** @type {LanguageManager} Shared i18n instance */
export const i18n = new LanguageManager();

/**
 * Convenience translate helper.
 * @param {string} key
 * @param {Object} [params]
 * @param {string} [lang]
 */
export function t(key, params, lang) {
  return i18n.t(key, params, lang);
}

export default i18n;
