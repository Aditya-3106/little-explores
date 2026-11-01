/**
 * @file indexeddb-adapter.js
 * @description Robust IndexedDB storage adapter for Little Explorers.
 * Manages activities, collections, child profiles, progress, history, and media.
 * @module storage/indexeddb-adapter
 */

import { DB_NAME, DB_VERSION } from '../core/config.js';

let dbInstance = null;

/**
 * Open or upgrade the Little Explorers IndexedDB instance.
 * @returns {Promise<IDBDatabase>}
 */
export function openDatabase() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Activities Store
      if (!db.objectStoreNames.contains('activities')) {
        const activityStore = db.createObjectStore('activities', { keyPath: 'id' });
        activityStore.createIndex('domain', 'domain', { unique: false });
        activityStore.createIndex('activityType', 'activityType', { unique: false });
        activityStore.createIndex('status', 'status', { unique: false });
        activityStore.createIndex('createdBy', 'createdBy', { unique: false });
        activityStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // 2. Collections Store
      if (!db.objectStoreNames.contains('collections')) {
        const collStore = db.createObjectStore('collections', { keyPath: 'id' });
        collStore.createIndex('createdBy', 'createdBy', { unique: false });
      }

      // 3. Child Profiles Store
      if (!db.objectStoreNames.contains('childProfiles')) {
        db.createObjectStore('childProfiles', { keyPath: 'id' });
      }

      // 4. Progress Store
      if (!db.objectStoreNames.contains('progress')) {
        const progStore = db.createObjectStore('progress', { keyPath: 'id' }); // id is childId
        progStore.createIndex('childId', 'childId', { unique: true });
      }

      // 5. Activity History Store
      if (!db.objectStoreNames.contains('activityHistory')) {
        const histStore = db.createObjectStore('activityHistory', { keyPath: 'id', autoIncrement: true });
        histStore.createIndex('childId', 'childId', { unique: false });
        histStore.createIndex('activityId', 'activityId', { unique: false });
        histStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 6. Media Store (blobs / dataUrls)
      if (!db.objectStoreNames.contains('media')) {
        db.createObjectStore('media', { keyPath: 'id' });
      }

      // 7. Settings Store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject(new Error('Failed to open IndexedDB: ' + event.target.error));
    };
  });
}

/**
 * Execute a transaction on a store.
 * @param {string} storeName
 * @param {'readonly'|'readwrite'} mode
 * @param {Function} callback
 * @returns {Promise<any>}
 */
async function withStore(storeName, mode, callback) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    let result;

    tx.oncomplete = () => resolve(result);
    tx.onerror = (e) => reject(e.target.error);

    try {
      result = callback(store);
    } catch (err) {
      reject(err);
    }
  });
}

// ─── Question Repository ───────────────────────────────────────────────────

export const QuestionRepository = {
  async getAll() {
    return withStore('activities', 'readonly', (store) => {
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    });
  },

  async getById(id) {
    return withStore('activities', 'readonly', (store) => {
      return new Promise((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    });
  },

  async create(activity) {
    const record = {
      ...activity,
      id: activity.id || 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: activity.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: activity.status || 'draft',
      visibility: activity.visibility || 'family_private',
    };

    await withStore('activities', 'readwrite', (store) => {
      store.put(record);
    });

    return record;
  },

  async update(id, activityUpdates) {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Activity with id ${id} not found.`);
    }

    const updated = {
      ...existing,
      ...activityUpdates,
      id,
      updatedAt: new Date().toISOString(),
    };

    await withStore('activities', 'readwrite', (store) => {
      store.put(updated);
    });

    return updated;
  },

  async delete(id) {
    await withStore('activities', 'readwrite', (store) => {
      store.delete(id);
    });
    return true;
  },

  async search(filters = {}) {
    const all = await this.getAll();
    return all.filter((item) => {
      if (filters.domain && item.domain !== filters.domain) return false;
      if (filters.activityType && item.activityType !== filters.activityType) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.ageGroup) {
        if (Array.isArray(item.ageGroup)) {
          if (!item.ageGroup.includes(filters.ageGroup)) return false;
        } else if (item.ageGroup !== filters.ageGroup) {
          return false;
        }
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const enTitle = item.locales?.en?.title || item.title || '';
        const mrTitle = item.locales?.mr?.title || '';
        if (!enTitle.toLowerCase().includes(q) && !mrTitle.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  },

  async importMany(activities) {
    const imported = [];
    for (const act of activities) {
      await withStore('activities', 'readwrite', (store) => {
        store.put(act);
      });
      imported.push(act);
    }
    return imported;
  },

  async exportAll() {
    return this.getAll();
  },
};

// ─── Collection Repository ─────────────────────────────────────────────────

export const CollectionRepository = {
  async getAll() {
    return withStore('collections', 'readonly', (store) => {
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    });
  },

  async getById(id) {
    return withStore('collections', 'readonly', (store) => {
      return new Promise((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    });
  },

  async create(collection) {
    const record = {
      ...collection,
      id: collection.id || 'col_' + Date.now(),
      activityIds: collection.activityIds || [],
      createdAt: new Date().toISOString(),
    };
    await withStore('collections', 'readwrite', (store) => {
      store.put(record);
    });
    return record;
  },

  async update(id, updates) {
    const existing = await this.getById(id);
    if (!existing) throw new Error('Collection not found: ' + id);
    const updated = { ...existing, ...updates, id };
    await withStore('collections', 'readwrite', (store) => {
      store.put(updated);
    });
    return updated;
  },

  async delete(id) {
    await withStore('collections', 'readwrite', (store) => {
      store.delete(id);
    });
    return true;
  },

  async addActivity(collectionId, activityId) {
    const col = await this.getById(collectionId);
    if (!col) return false;
    if (!col.activityIds.includes(activityId)) {
      col.activityIds.push(activityId);
      await this.update(collectionId, { activityIds: col.activityIds });
    }
    return true;
  },

  async removeActivity(collectionId, activityId) {
    const col = await this.getById(collectionId);
    if (!col) return false;
    col.activityIds = col.activityIds.filter((id) => id !== activityId);
    await this.update(collectionId, { activityIds: col.activityIds });
    return true;
  },
};

// ─── Child Profile Repository ──────────────────────────────────────────────

export const ChildProfileRepository = {
  async getAll() {
    return withStore('childProfiles', 'readonly', (store) => {
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    });
  },

  async getById(id) {
    return withStore('childProfiles', 'readonly', (store) => {
      return new Promise((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    });
  },

  async create(profile) {
    const record = {
      ...profile,
      id: profile.id || 'child_' + Date.now(),
      nickname: profile.nickname || 'Little Explorer',
      ageGroup: profile.ageGroup || 'nursery',
      preferredLanguage: profile.preferredLanguage || 'en',
      createdAt: new Date().toISOString(),
    };
    await withStore('childProfiles', 'readwrite', (store) => {
      store.put(record);
    });
    return record;
  },

  async update(id, updates) {
    const existing = await this.getById(id);
    if (!existing) throw new Error('Child profile not found: ' + id);
    const updated = { ...existing, ...updates, id };
    await withStore('childProfiles', 'readwrite', (store) => {
      store.put(updated);
    });
    return updated;
  },

  async delete(id) {
    await withStore('childProfiles', 'readwrite', (store) => {
      store.delete(id);
    });
    return true;
  },
};

// ─── Progress & History Repository ─────────────────────────────────────────

export const ProgressRepository = {
  async getProgress(childId) {
    return withStore('progress', 'readonly', (store) => {
      return new Promise((resolve, reject) => {
        const req = store.get(childId);
        req.onsuccess = () =>
          resolve(
            req.result || {
              id: childId,
              childId,
              completedActivities: [],
              domainsExplored: {},
              skillsPracticed: {},
              achievements: [],
              lastActive: new Date().toISOString(),
            }
          );
        req.onerror = () => reject(req.error);
      });
    });
  },

  async recordActivity(childId, activityResult) {
    // 1. Add to history
    await withStore('activityHistory', 'readwrite', (store) => {
      store.add({
        childId,
        activityId: activityResult.activityId,
        domain: activityResult.domain,
        correct: activityResult.correct,
        attempts: activityResult.attempts,
        hintsUsed: activityResult.hintsUsed,
        timestamp: new Date().toISOString(),
      });
    });

    // 2. Update cumulative progress
    const progress = await this.getProgress(childId);
    if (!progress.completedActivities.includes(activityResult.activityId)) {
      progress.completedActivities.push(activityResult.activityId);
    }

    const domain = activityResult.domain || 'general';
    progress.domainsExplored[domain] = (progress.domainsExplored[domain] || 0) + 1;

    if (activityResult.learningObjective) {
      progress.skillsPracticed[activityResult.learningObjective] =
        (progress.skillsPracticed[activityResult.learningObjective] || 0) + 1;
    }

    progress.lastActive = new Date().toISOString();

    await withStore('progress', 'readwrite', (store) => {
      store.put(progress);
    });

    return progress;
  },

  async getActivityHistory(childId, limit = 20) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('activityHistory', 'readonly');
      const store = tx.objectStore('activityHistory');
      const req = store.getAll();
      req.onsuccess = () => {
        const all = (req.result || []).filter((h) => h.childId === childId);
        all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        resolve(all.slice(0, limit));
      };
      req.onerror = () => reject(req.error);
    });
  },
};

// ─── 5. Media Repository ───────────────────────────────────────────────────

export const MediaRepository = {
  async save(id, blobOrDataUrl, mimeType, meta = {}) {
    const record = {
      id: id || 'media_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      data: blobOrDataUrl,
      mimeType: mimeType || 'image/png',
      meta,
      createdAt: new Date().toISOString(),
    };
    await withStore('media', 'readwrite', (store) => {
      store.put(record);
    });
    return record;
  },

  async getById(id) {
    return withStore('media', 'readonly', (store) => store.get(id));
  },

  async getAll() {
    return withStore('media', 'readonly', (store) => store.getAll());
  },

  async delete(id) {
    await withStore('media', 'readwrite', (store) => store.delete(id));
    return true;
  },
};

// ─── 6. Full Backup & Restore Manager ──────────────────────────────────────

export const BackupRepository = {
  async createFullBackup() {
    const [activities, collections, profiles, progress, history, media] = await Promise.all([
      QuestionRepository.getAll(),
      CollectionRepository.getAll(),
      ChildProfileRepository.getAll(),
      withStore('progress', 'readonly', (s) => s.getAll()),
      withStore('activityHistory', 'readonly', (s) => s.getAll()),
      withStore('media', 'readonly', (s) => s.getAll()),
    ]);

    return {
      version: 1,
      appName: 'Little Explorers',
      exportedAt: new Date().toISOString(),
      data: {
        activities,
        collections,
        profiles,
        progress,
        history,
        media,
      },
    };
  },

  async restoreFullBackup(backupObj) {
    if (!backupObj || typeof backupObj !== 'object') {
      throw new Error('Invalid backup format');
    }
    const data = backupObj.data || backupObj;

    if (Array.isArray(data.activities)) {
      await QuestionRepository.importMany(data.activities);
    }
    if (Array.isArray(data.collections)) {
      for (const col of data.collections) {
        await CollectionRepository.create(col);
      }
    }
    if (Array.isArray(data.profiles)) {
      for (const prof of data.profiles) {
        await ChildProfileRepository.create(prof);
      }
    }
    if (Array.isArray(data.progress)) {
      await withStore('progress', 'readwrite', (s) => {
        for (const p of data.progress) s.put(p);
      });
    }
    if (Array.isArray(data.history)) {
      await withStore('activityHistory', 'readwrite', (s) => {
        for (const h of data.history) s.put(h);
      });
    }
    if (Array.isArray(data.media)) {
      await withStore('media', 'readwrite', (s) => {
        for (const m of data.media) s.put(m);
      });
    }

    return true;
  },
};

