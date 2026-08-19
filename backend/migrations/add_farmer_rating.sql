-- Add provider rating columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS provider_rating INTEGER CHECK (provider_rating >= 1 AND provider_rating <= 5);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS provider_feedback TEXT;
