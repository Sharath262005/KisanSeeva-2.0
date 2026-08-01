/**
 * Migration: Add OTP columns to users table
 * Safe to run multiple times — uses ALTER TABLE ... ADD COLUMN IF NOT EXISTS
 */
const db = require("../config/db");

const addOtpColumns = async () => {
  try {
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS otp_code VARCHAR(6),
      ADD COLUMN IF NOT EXISTS otp_expires TIMESTAMP
    `);
    console.log("[Migration] OTP columns ensured on users table.");
  } catch (err) {
    console.error("[Migration] Failed to add OTP columns:", err.message);
  }
};

module.exports = addOtpColumns;
