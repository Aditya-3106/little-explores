/**
 * @file cloud-adapter.js
 * @description Cloud storage adapter stub (Supabase ready).
 * @module storage/cloud-adapter
 */

export const CloudAdapter = {
  isAvailable() {
    return false; // Cloud sync is an optional future capability
  },

  async getAll() {
    throw new Error('Cloud storage not configured. Please use local storage mode.');
  },

  async getById(id) {
    throw new Error('Cloud storage not configured. Please use local storage mode.');
  },

  async create(record) {
    throw new Error('Cloud storage not configured. Please use local storage mode.');
  },

  async update(id, updates) {
    throw new Error('Cloud storage not configured. Please use local storage mode.');
  },

  async delete(id) {
    throw new Error('Cloud storage not configured. Please use local storage mode.');
  },
};

