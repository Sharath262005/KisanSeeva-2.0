/**
 * Migration: Add farmer rating columns to bookings table
 * Safe to run multiple times — uses ALTER TABLE ... ADD COLUMN IF NOT EXISTS
 */
const db = require('../config/db');

const addFarmerRatingColumns = async () => {
  try {
    await db.query(`
      ALTER TABLE bookings
      ADD COLUMN IF NOT EXISTS provider_rating INTEGER CHECK (provider_rating >= 1 AND provider_rating <= 5),
      ADD COLUMN IF NOT EXISTS provider_feedback TEXT
    `);
    console.log('[Migration] Farmer rating columns ensured on bookings table.');
  } catch (err) {
    console.error('[Migration] Failed to add farmer rating columns:', err.message);
  }
};

module.exports = addFarmerRatingColumns;
