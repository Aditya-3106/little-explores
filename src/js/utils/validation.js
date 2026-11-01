/**
 * @file validation.js
 * @description Input validation, sanitization, and security checks.
 * @module utils/validation
 */

import { MAX_IMAGE_SIZE as MAX_IMAGE_SIZE_BYTES, MAX_AUDIO_SIZE as MAX_AUDIO_SIZE_BYTES, ALLOWED_IMAGE_TYPES, ALLOWED_AUDIO_TYPES } from '../core/config.js';

/**
 * Sanitize text to avoid HTML/script injection.
 * @param {string} text
 * @returns {string}
 */
export function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate an identifier string.
 * @param {string} id
 * @returns {boolean}
 */
export function isValidId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{3,64}$/.test(id);
}

/**
 * Validate a media file before upload/saving.
 * @param {File|Blob} file
 * @param {'image'|'audio'} type
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateMediaFile(file, type) {
  const errors = [];
  if (!file) {
    return { valid: false, errors: ['No file provided'] };
  }

  if (type === 'image') {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      errors.push(`Image file size must be under ${Math.round(MAX_IMAGE_SIZE_BYTES / (1024 * 1024))} MB.`);
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      errors.push(`Invalid image type: ${file.type}. Allowed: JPG, PNG, WebP, SVG.`);
    }
  } else if (type === 'audio') {
    if (file.size > MAX_AUDIO_SIZE_BYTES) {
      errors.push(`Audio file size must be under ${Math.round(MAX_AUDIO_SIZE_BYTES / (1024 * 1024))} MB.`);
    }
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      errors.push(`Invalid audio type: ${file.type}. Allowed: MP3, WAV, OGG, WebM.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate locale content dictionary.
 * @param {Object} locales
 * @param {string[]} requiredLanguages
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function isValidLanguageContent(locales, requiredLanguages = ['en']) {
  const errors = [];
  if (!locales || typeof locales !== 'object') {
    return { valid: false, errors: ['Missing locale data'] };
  }

  for (const lang of requiredLanguages) {
    if (!locales[lang]) {
      errors.push(`Language '${lang}' is missing.`);
      continue;
    }
    if (!locales[lang].instruction || locales[lang].instruction.trim().length === 0) {
      errors.push(`Instruction in language '${lang}' is required.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate imported JSON payload for safety and schema structure.
 * @param {string|Object} rawData
 * @returns {{ valid: boolean, data?: any, errors: string[] }}
 */
export function validateImportData(rawData) {
  const errors = [];
  let parsed;

  try {
    parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
  } catch (err) {
    return { valid: false, errors: ['Invalid JSON syntax: ' + err.message] };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, errors: ['Imported content must be an object or array'] };
  }

  const items = Array.isArray(parsed) ? parsed : (parsed.activities || [parsed]);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.id || typeof item.id !== 'string') {
      errors.push(`Item at index ${i} is missing a valid 'id'.`);
    }
    if (!item.activityType || typeof item.activityType !== 'string') {
      errors.push(`Item at index ${i} is missing 'activityType'.`);
    }
    if (!item.locales || typeof item.locales !== 'object') {
      errors.push(`Item at index ${i} is missing 'locales'.`);
    }
    // Block executable payload strings or scripts
    const stringified = JSON.stringify(item);
    if (/<script|javascript:|data:text\/html/i.test(stringified)) {
      errors.push(`Security error: Potentially dangerous script tag detected in item at index ${i}.`);
    }
  }

  return {
    valid: errors.length === 0,
    data: items,
    errors,
  };
}

