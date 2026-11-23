-- Prevent double-booking at the database level: no two active bookings
-- for the same room may have overlapping [check_in, check_out) ranges.
CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_no_overlap"
  EXCLUDE USING gist ("room_id" WITH =, daterange("check_in", "check_out", '[)') WITH &&)
  WHERE ("status" = 'active');
