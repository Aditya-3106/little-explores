/**
 * @module ActivityRegistry
 * @description Central registry for all activity templates in the Little Explorers platform.
 * Activity types register themselves here and are looked up by the Activity Engine.
 * @version 1.0.0
 */

/** @type {Object<string, ActivityTypeConfig>} Internal registry store */
const ActivityRegistry = {};

/**
 * @typedef {Object} LocalizedString
 * @property {string} en - English text
 * @property {string} mr - Marathi text
 */

/**
 * @typedef {Object} ActivityTypeConfig
 * @property {string} type - Unique type identifier (e.g. 'tap-select')
 * @property {number} version - Template version number
 * @property {LocalizedString} name - Localized display name
 * @property {LocalizedString} description - Localized description
 * @property {string} icon - Emoji icon for the type
 * @property {string[]} ageGroups - Applicable age groups (nursery, lkg, ukg)
 * @property {string[]} domains - Applicable learning domains
 * @property {Function} createEditor - Creates editor form for Parent Studio
 * @property {Function} validate - Validates activity payload
 * @property {Function} render - Renders the activity for child interaction
 * @property {Function} evaluate - Evaluates child's response
 * @property {Function} getFeedback - Returns child-friendly feedback
 */

/** Required methods every activity type must implement */
const REQUIRED_METHODS = ['createEditor', 'validate', 'render', 'evaluate', 'getFeedback'];

/** Required metadata fields */
const REQUIRED_FIELDS = ['type', 'version', 'name', 'description', 'icon', 'ageGroups', 'domains'];

/**
 * Register a new activity type in the registry.
 * @param {string} type - Unique type identifier
 * @param {ActivityTypeConfig} config - Full activity type configuration
 * @throws {Error} If type is already registered or config is invalid
 */
export function registerActivityType(type, config) {
  if (!type || typeof type !== 'string') {
    throw new Error('Activity type must be a non-empty string');
  }

  if (ActivityRegistry[type]) {
    throw new Error(`Activity type already registered: ${type}`);
  }

  // Validate required fields
  for (const field of REQUIRED_FIELDS) {
    if (config[field] === undefined || config[field] === null) {
      throw new Error(`Activity type "${type}" is missing required field: ${field}`);
    }
  }

  // Validate required methods
  for (const method of REQUIRED_METHODS) {
    if (typeof config[method] !== 'function') {
      throw new Error(`Activity type "${type}" is missing required method: ${method}`);
    }
  }

  // Validate version
  if (typeof config.version !== 'number' || config.version < 1) {
    throw new Error(`Activity type "${type}" must have a positive integer version`);
  }

  // Validate name and description have at least 'en'
  if (!config.name.en) {
    throw new Error(`Activity type "${type}" must have an English name`);
  }

  ActivityRegistry[type] = Object.freeze({ ...config });
}

/**
 * Get an activity type configuration by type ID.
 * @param {string} type - The type identifier
 * @returns {ActivityTypeConfig|null} The config or null if not found
 */
export function getActivityType(type) {
  return ActivityRegistry[type] || null;
}

/**
 * Get all registered activity type IDs.
 * @returns {string[]} Array of registered type identifiers
 */
export function getAllActivityTypes() {
  return Object.keys(ActivityRegistry);
}

/**
 * Get metadata about an activity type (without methods).
 * @param {string} type - The type identifier
 * @returns {Object|null} Metadata object or null
 */
export function getActivityTypeInfo(type) {
  const config = ActivityRegistry[type];
  if (!config) return null;

  return {
    type: config.type,
    version: config.version,
    name: config.name,
    description: config.description,
    icon: config.icon,
    ageGroups: config.ageGroups,
    domains: config.domains
  };
}

/**
 * Check if an activity type is registered.
 * @param {string} type - The type identifier
 * @returns {boolean} True if registered
 */
export function isRegistered(type) {
  return type in ActivityRegistry;
}

/**
 * Get all activity types for a specific age group.
 * @param {string} ageGroup - The age group (nursery, lkg, ukg)
 * @returns {Object[]} Array of activity type info objects
 */
export function getActivityTypesForAgeGroup(ageGroup) {
  return Object.values(ActivityRegistry)
    .filter(config => config.ageGroups.includes(ageGroup))
    .map(config => ({
      type: config.type,
      version: config.version,
      name: config.name,
      description: config.description,
      icon: config.icon,
      domains: config.domains
    }));
}

/**
 * Get all activity types for a specific learning domain.
 * @param {string} domain - The learning domain
 * @returns {Object[]} Array of activity type info objects
 */
export function getActivityTypesForDomain(domain) {
  return Object.values(ActivityRegistry)
    .filter(config => config.domains.includes(domain))
    .map(config => ({
      type: config.type,
      version: config.version,
      name: config.name,
      description: config.description,
      icon: config.icon,
      ageGroups: config.ageGroups
    }));
}

/**
 * Unregister an activity type (mainly for testing).
 * @param {string} type - The type identifier
 * @returns {boolean} True if it was removed
 */
export function unregisterActivityType(type) {
  if (ActivityRegistry[type]) {
    delete ActivityRegistry[type];
    return true;
  }
  return false;
}
