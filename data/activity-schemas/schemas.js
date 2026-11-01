/**
 * @file schemas.js
 * @description JSON schemas for payload validation across all 18 activity types.
 */

export const ACTIVITY_SCHEMAS = {
  'tap-select': {
    required: ['options'],
    properties: {
      options: { type: 'array', minItems: 2, maxItems: 6 },
    },
  },
  'listen-choose': {
    required: ['options'],
    properties: {
      options: { type: 'array', minItems: 2 },
    },
  },
  'drag-drop': {
    required: ['targets', 'items'],
  },
  'matching-pairs': {
    required: ['pairs'],
    properties: {
      pairs: { type: 'array', minItems: 2 },
    },
  },
  'count-collect': {
    required: ['targetCount'],
  },
  'sorting': {
    required: ['categories', 'items'],
  },
  'patterns': {
    required: ['sequence', 'options'],
  },
  'number-sequence': {
    required: ['numbers'],
  },
  'picture-sequence': {
    required: ['steps'],
  },
  'find-difference': {
    required: ['differencesCount'],
  },
  'memory-match': {
    required: ['cards'],
  },
  'shadow-matching': {
    required: ['pairs'],
  },
  'missing-piece': {
    required: [],
  },
  'picture-puzzle': {
    required: [],
  },
  'story-response': {
    required: [],
  },
  'trace-draw': {
    required: [],
  },
  'colour-create': {
    required: [],
  },
  'explore-discover': {
    required: [],
  },
};

