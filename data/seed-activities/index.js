/**
 * @file index.js
 * @description Master collection of default educator-designed seed activities.
 */

import { letterLandActivities } from './letter-land.js';
import { numberTownActivities } from './number-town.js';
import { shapeGardenActivities } from './shape-garden.js';
import { animalWorldActivities } from './animal-world.js';
import { puzzlePlanetActivities } from './puzzle-planet.js';
import { feelingsFriendsActivities } from './feelings-friends.js';

export const ALL_SEED_ACTIVITIES = [
  ...letterLandActivities,
  ...numberTownActivities,
  ...shapeGardenActivities,
  ...animalWorldActivities,
  ...puzzlePlanetActivities,
  ...feelingsFriendsActivities,
];

