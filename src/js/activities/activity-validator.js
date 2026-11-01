/**
 * @module ActivityValidator
 * @description Validates activity data for the Little Explorers platform.
 * Performs structural validation, payload validation, and locale checks.
 * @version 1.0.0
 */

import { getActivityType, isRegistered } from './activity-registry.js';

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether the data is valid
 * @property {string[]} errors - Array of error messages
 */

/** Fields required on every activity data object */
const BASE_REQUIRED_FIELDS = ['type', 'payload'];

/** Supported locales */
const SUPPORTED_LOCALES = ['en', 'mr'];

/**
 * Validate a complete activity data object.
 * @param {Object} activityData - The activity data to validate
 * @returns {ValidationResult} Validation result
 */
export function validateActivity(activityData) {
  const errors = [];

  // Check for null/undefined
  if (!activityData || typeof activityData !== 'object') {
    return { valid: false, errors: ['Activity data must be a non-null object'] };
  }

  // Check base required fields
  for (const field of BASE_REQUIRED_FIELDS) {
    if (activityData[field] === undefined || activityData[field] === null) {
      errors.push(`Missing required field: "${field}"`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Check type is a string
  if (typeof activityData.type !== 'string' || activityData.type.trim() === '') {
    errors.push('"type" must be a non-empty string');
    return { valid: false, errors };
  }

  // Check if the type is registered
  if (!isRegistered(activityData.type)) {
    errors.push(`Unknown activity type: "${activityData.type}"`);
    return { valid: false, errors };
  }

  // Validate payload is an object
  if (typeof activityData.payload !== 'object' || Array.isArray(activityData.payload)) {
    errors.push('"payload" must be a plain object');
    return { valid: false, errors };
  }

  // Validate locales if present
  if (activityData.locales) {
    const localeResult = validateLocales(activityData.locales);
    if (!localeResult.valid) {
      errors.push(...localeResult.errors);
    }
  }

  // Type-specific payload validation
  const payloadResult = validatePayload(activityData.type, activityData.payload);
  if (!payloadResult.valid) {
    errors.push(...payloadResult.errors);
  }

  // Validate optional fields if present
  if (activityData.difficulty !== undefined) {
    if (!['easy', 'medium', 'hard'].includes(activityData.difficulty)) {
      errors.push('"difficulty" must be one of: easy, medium, hard');
    }
  }

  if (activityData.ageGroup !== undefined) {
    if (!['nursery', 'lkg', 'ukg'].includes(activityData.ageGroup)) {
      errors.push('"ageGroup" must be one of: nursery, lkg, ukg');
    }
  }

  if (activityData.timeLimit !== undefined) {
    if (typeof activityData.timeLimit !== 'number' || activityData.timeLimit < 0) {
      errors.push('"timeLimit" must be a non-negative number (seconds)');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate the payload for a specific activity type.
 * Delegates to the type's own validate() method if registered.
 * @param {string} type - Activity type identifier
 * @param {Object} payload - The payload to validate
 * @returns {ValidationResult} Validation result
 */
export function validatePayload(type, payload) {
  if (!isRegistered(type)) {
    return { valid: false, errors: [`Unknown activity type: "${type}"`] };
  }

  const template = getActivityType(type);

  try {
    // Use the type's built-in validator
    const result = template.validate({ type, payload });
    return {
      valid: result.valid === true,
      errors: Array.isArray(result.errors) ? result.errors : []
    };
  } catch (err) {
    return {
      valid: false,
      errors: [`Validation error for type "${type}": ${err.message}`]
    };
  }
}

/**
 * Validate the locales object for an activity.
 * @param {Object} locales - Locales object keyed by language code
 * @returns {ValidationResult} Validation result
 */
export function validateLocales(locales) {
  const errors = [];

  if (!locales || typeof locales !== 'object') {
    errors.push('"locales" must be an object');
    return { valid: false, errors };
  }

  // Must have at least English
  if (!locales.en) {
    errors.push('Locales must include English ("en")');
  }

  // Validate each locale
  for (const [lang, content] of Object.entries(locales)) {
    if (!SUPPORTED_LOCALES.includes(lang)) {
      errors.push(`Unsupported locale: "${lang}". Supported: ${SUPPORTED_LOCALES.join(', ')}`);
      continue;
    }

    if (typeof content !== 'object' || content === null) {
      errors.push(`Locale "${lang}" must be an object`);
      continue;
    }

    // Check for instruction text
    if (content.instruction && typeof content.instruction !== 'string') {
      errors.push(`Locale "${lang}": "instruction" must be a string`);
    }

    // Check for question text
    if (content.question && typeof content.question !== 'string') {
      errors.push(`Locale "${lang}": "question" must be a string`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get the list of required fields for an activity type.
 * @param {string} type - Activity type identifier
 * @returns {string[]} Array of required field names
 */
export function getRequiredFields(type) {
  const baseFields = [...BASE_REQUIRED_FIELDS];

  // Type-specific required payload fields
  const payloadFields = {
    'tap-select': ['options'],
    'listen-choose': ['options'],
    'drag-drop': ['items', 'dropZones', 'correctMapping'],
    'matching-pairs': ['pairs'],
    'count-collect': ['targetCount', 'targetObject'],
    'sorting': ['categories', 'items'],
    'patterns': ['pattern', 'options'],
    'number-sequence': ['numbers', 'correctOrder'],
    'picture-sequence': ['pictures', 'correctOrder'],
    'find-difference': ['differences'],
    'memory-match': ['cards'],
    'shadow-matching': ['objects', 'shadows', 'correctMapping'],
    'missing-piece': ['mainImage', 'missingArea', 'pieces'],
    'picture-puzzle': ['image', 'gridSize'],
    'story-response': ['storySegments'],
    'trace-draw': ['traceTemplate', 'traceType'],
    'colour-create': ['colors'],
    'explore-discover': ['scene', 'discoveryPoints']
  };

  return {
    base: baseFields,
    payload: payloadFields[type] || []
  };
}

/**
 * Get the payload schema description for an activity type.
 * @param {string} type - Activity type identifier
 * @returns {Object|null} Schema description or null
 */
export function getPayloadSchema(type) {
  const schemas = {
    'tap-select': {
      options: {
        type: 'array',
        minItems: 2,
        maxItems: 6,
        itemFields: {
          id: { type: 'string', required: true },
          label: { type: 'object', required: false, description: 'Localized label {en, mr}' },
          image: { type: 'string', required: false, description: 'Image URL or emoji' },
          correct: { type: 'boolean', required: true }
        }
      }
    },
    'listen-choose': {
      audioInstruction: { type: 'string', required: false, description: 'Audio URL for instruction' },
      options: {
        type: 'array',
        minItems: 2,
        maxItems: 6,
        itemFields: {
          id: { type: 'string', required: true },
          label: { type: 'object', required: false },
          image: { type: 'string', required: false },
          correct: { type: 'boolean', required: true }
        }
      }
    },
    'drag-drop': {
      items: {
        type: 'array',
        itemFields: {
          id: { type: 'string', required: true },
          label: { type: 'object', required: false },
          image: { type: 'string', required: false }
        }
      },
      dropZones: {
        type: 'array',
        itemFields: {
          id: { type: 'string', required: true },
          label: { type: 'object', required: false }
        }
      },
      correctMapping: {
        type: 'object',
        description: 'Maps item IDs to dropZone IDs'
      }
    },
    'matching-pairs': {
      pairs: {
        type: 'array',
        itemFields: {
          left: { type: 'object', required: true },
          right: { type: 'object', required: true }
        }
      }
    },
    'count-collect': {
      targetObject: { type: 'string', required: true, description: 'Emoji or image URL' },
      targetCount: { type: 'number', required: true },
      availableObjects: { type: 'array', required: false }
    },
    'sorting': {
      categories: {
        type: 'array',
        itemFields: {
          id: { type: 'string', required: true },
          label: { type: 'object', required: true }
        }
      },
      items: {
        type: 'array',
        itemFields: {
          id: { type: 'string', required: true },
          correctCategory: { type: 'string', required: true }
        }
      }
    },
    'patterns': {
      pattern: { type: 'array', required: true },
      options: { type: 'array', required: true },
      missingIndex: { type: 'number', required: false }
    },
    'number-sequence': {
      numbers: { type: 'array', required: true },
      correctOrder: { type: 'array', required: true },
      direction: { type: 'string', required: false }
    },
    'picture-sequence': {
      pictures: { type: 'array', required: true },
      correctOrder: { type: 'array', required: true }
    },
    'find-difference': {
      image1: { type: 'string', required: false },
      image2: { type: 'string', required: false },
      differences: {
        type: 'array',
        itemFields: {
          x: { type: 'number', required: true },
          y: { type: 'number', required: true },
          radius: { type: 'number', required: true }
        }
      }
    },
    'memory-match': {
      cards: {
        type: 'array',
        description: 'Array of card values (duplicated to form pairs)'
      }
    },
    'shadow-matching': {
      objects: { type: 'array', required: true },
      shadows: { type: 'array', required: true },
      correctMapping: { type: 'object', required: true }
    },
    'missing-piece': {
      mainImage: { type: 'string', required: true },
      missingArea: { type: 'object', required: true },
      pieces: { type: 'array', required: true }
    },
    'picture-puzzle': {
      image: { type: 'string', required: true },
      gridSize: { type: 'string', required: true }
    },
    'story-response': {
      storySegments: { type: 'array', required: true },
      questions: { type: 'array', required: false }
    },
    'trace-draw': {
      traceTemplate: { type: 'string', required: true },
      traceType: { type: 'string', required: true }
    },
    'colour-create': {
      colors: { type: 'array', required: true },
      templateImage: { type: 'string', required: false }
    },
    'explore-discover': {
      scene: { type: 'object', required: true },
      discoveryPoints: { type: 'array', required: true }
    }
  };

  return schemas[type] || null;
}
