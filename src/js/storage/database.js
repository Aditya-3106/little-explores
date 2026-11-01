/**
 * @file database.js
 * @description Central database interface exporting active repository implementations.
 * @module storage/database
 */

import {
  QuestionRepository,
  CollectionRepository,
  ChildProfileRepository,
  ProgressRepository,
  MediaRepository,
  BackupRepository,
  openDatabase,
} from './indexeddb-adapter.js';

export const db = {
  questions: QuestionRepository,
  collections: CollectionRepository,
  profiles: ChildProfileRepository,
  progress: ProgressRepository,
  media: MediaRepository,
  backup: BackupRepository,
  init: openDatabase,
};

export {
  QuestionRepository,
  CollectionRepository,
  ChildProfileRepository,
  ProgressRepository,
  MediaRepository,
  BackupRepository,
};

