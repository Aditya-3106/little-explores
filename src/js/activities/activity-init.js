/**
 * @file activity-init.js
 * @description Registers all 18 core interactive activity types into the ActivityRegistry.
 * @module activities/activity-init
 */

import { registerActivityType } from './activity-registry.js';

import TapSelect from './types/tap-select.js';
import ListenChoose from './types/listen-choose.js';
import DragDrop from './types/drag-drop.js';
import MatchingPairs from './types/matching-pairs.js';
import CountCollect from './types/count-collect.js';
import Sorting from './types/sorting.js';
import Patterns from './types/patterns.js';
import NumberSequence from './types/number-sequence.js';
import PictureSequence from './types/picture-sequence.js';
import FindDifference from './types/find-difference.js';
import MemoryMatch from './types/memory-match.js';
import ShadowMatching from './types/shadow-matching.js';
import MissingPiece from './types/missing-piece.js';
import PicturePuzzle from './types/picture-puzzle.js';
import StoryResponse from './types/story-response.js';
import TraceDraw from './types/trace-draw.js';
import ColourCreate from './types/colour-create.js';
import ExploreDiscover from './types/explore-discover.js';

export function initializeActivityTypes() {
  const types = [
    TapSelect,
    ListenChoose,
    DragDrop,
    MatchingPairs,
    CountCollect,
    Sorting,
    Patterns,
    NumberSequence,
    PictureSequence,
    FindDifference,
    MemoryMatch,
    ShadowMatching,
    MissingPiece,
    PicturePuzzle,
    StoryResponse,
    TraceDraw,
    ColourCreate,
    ExploreDiscover,
  ];

  for (const t of types) {
    try {
      registerActivityType(t.type, t);
    } catch (_) {
      // Ignore if already registered
    }
  }
}

