/**
 * @file config.js
 * @description Application configuration constants for Little Explorers — a bilingual
 *   educational platform for young children (3-5 years).
 * @module core/config
 */

// ─── App Identity ────────────────────────────────────────────────────────────

/** @constant {string} */
export const APP_NAME = 'Little Explorers';

/** @constant {string} */
export const APP_VERSION = '1.0.0';

// ─── Language & Locale ───────────────────────────────────────────────────────

/** @constant {string[]} Supported language codes */
export const SUPPORTED_LANGUAGES = ['en', 'mr'];

/** @constant {string} Default language code */
export const DEFAULT_LANGUAGE = 'en';

// ─── Age Groups ──────────────────────────────────────────────────────────────

/**
 * @constant {string[]} Supported age groups
 *   nursery → 3-4 years, lkg → 4-5 years
 */
export const AGE_GROUPS = ['nursery', 'lkg'];

// ─── Learning Domains ────────────────────────────────────────────────────────

/**
 * Each domain represents a broad educational area.
 * @constant {Object[]}
 */
export const LEARNING_DOMAINS = [
  {
    id: 'literacy',
    name: { en: 'Literacy', mr: 'साक्षरता' },
    icon: '📖',
    color: '#FF6B6B',
  },
  {
    id: 'numeracy',
    name: { en: 'Numeracy', mr: 'गणित' },
    icon: '🔢',
    color: '#4ECDC4',
  },
  {
    id: 'spatial',
    name: { en: 'Spatial Awareness', mr: 'अवकाशीय जाणीव' },
    icon: '📐',
    color: '#45B7D1',
  },
  {
    id: 'nature',
    name: { en: 'Nature & Science', mr: 'निसर्ग आणि विज्ञान' },
    icon: '🌿',
    color: '#96CEB4',
  },
  {
    id: 'social',
    name: { en: 'Social-Emotional', mr: 'सामाजिक-भावनिक' },
    icon: '🤝',
    color: '#DDA0DD',
  },
  {
    id: 'cognitive',
    name: { en: 'Cognitive & Logic', mr: 'बोधात्मक आणि तर्क' },
    icon: '🧩',
    color: '#FFD93D',
  },
];

// ─── Learning Worlds ─────────────────────────────────────────────────────────

/**
 * The six themed learning worlds children can explore.
 * @constant {Object[]}
 */
export const LEARNING_WORLDS = [
  {
    id: 'letter-land',
    name: { en: 'Letter Land', mr: 'अक्षर नगरी' },
    description: {
      en: 'Discover the magic of letters and words!',
      mr: 'अक्षरे आणि शब्दांची जादू शोधा!',
    },
    domains: ['literacy'],
    color: '#FF6B6B',
    icon: '🔤',
  },
  {
    id: 'number-town',
    name: { en: 'Number Town', mr: 'अंक नगर' },
    description: {
      en: 'Count, compare and play with numbers!',
      mr: 'मोजा, तुलना करा आणि अंकांसोबत खेळा!',
    },
    domains: ['numeracy'],
    color: '#4ECDC4',
    icon: '🔢',
  },
  {
    id: 'shape-garden',
    name: { en: 'Shape Garden', mr: 'आकार बाग' },
    description: {
      en: 'Explore shapes, patterns and colours!',
      mr: 'आकार, नमुने आणि रंग शोधा!',
    },
    domains: ['spatial'],
    color: '#45B7D1',
    icon: '🔷',
  },
  {
    id: 'animal-world',
    name: { en: 'Animal World', mr: 'प्राणी विश्व' },
    description: {
      en: 'Meet animals and explore nature!',
      mr: 'प्राण्यांना भेटा आणि निसर्ग शोधा!',
    },
    domains: ['nature'],
    color: '#96CEB4',
    icon: '🐾',
  },
  {
    id: 'puzzle-planet',
    name: { en: 'Puzzle Planet', mr: 'कोडे ग्रह' },
    description: {
      en: 'Solve puzzles and think smart!',
      mr: 'कोडी सोडवा आणि हुशार विचार करा!',
    },
    domains: ['cognitive'],
    color: '#FFD93D',
    icon: '🧩',
  },
  {
    id: 'feelings-friends',
    name: { en: 'Feelings and Friends', mr: 'भावना आणि मित्र' },
    description: {
      en: 'Understand feelings and make friends!',
      mr: 'भावना समजून घ्या आणि मित्र बनवा!',
    },
    domains: ['social'],
    color: '#DDA0DD',
    icon: '💕',
  },
];

// ─── Activity Configuration ──────────────────────────────────────────────────

/**
 * Possible statuses for any activity / question.
 * @enum {string}
 */
export const ACTIVITY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

/**
 * The 18 supported activity types.
 * @constant {string[]}
 */
export const ACTIVITY_TYPES = [
  'multiple-choice',
  'true-false',
  'matching',
  'sorting',
  'ordering',
  'fill-in-blank',
  'tracing',
  'counting',
  'colour-recognition',
  'pattern-completion',
  'odd-one-out',
  'picture-identification',
  'sound-matching',
  'story-sequencing',
  'emotion-recognition',
  'size-comparison',
  'categorisation',
  'puzzle',
];

// ─── Upload & Media Limits ───────────────────────────────────────────────────

/** @constant {number} Maximum image upload size in bytes (5 MB) */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/** @constant {number} Maximum audio upload size in bytes (10 MB) */
export const MAX_AUDIO_SIZE = 10 * 1024 * 1024;

/** @constant {string[]} Allowed image MIME types */
export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

/** @constant {string[]} Allowed audio MIME types */
export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'audio/mp4',
];

// ─── Security / UX ──────────────────────────────────────────────────────────

/** @constant {number} Length of the numeric parent PIN */
export const PARENT_PIN_LENGTH = 4;

/** @constant {number} Minimum touch target size in CSS pixels (WCAG) */
export const TOUCH_TARGET_MIN_SIZE = 48;

// ─── IndexedDB ───────────────────────────────────────────────────────────────

/** @constant {string} Database name for IndexedDB */
export const DB_NAME = 'little-explorers-db';

/** @constant {number} Current database schema version */
export const DB_VERSION = 1;

// ─── Misc Defaults ───────────────────────────────────────────────────────────

/** @constant {number} Default number of hints before showing explanation */
export const MAX_HINTS = 3;

/** @constant {number} Default session timeout for parent area (ms) – 10 min */
export const PARENT_SESSION_TIMEOUT = 10 * 60 * 1000;

/** @constant {string} Mascot name used throughout the app */
export const MASCOT_NAME = 'Milo';
