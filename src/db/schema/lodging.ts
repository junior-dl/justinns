import {
  pgTable, pgEnum, serial, integer, text, varchar, numeric, date, timestamp, boolean, uniqueIndex, index, check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";

export const lodgingType = pgEnum("lodging_type", ["hotel", "inn", "pension"]);
export const bookingStatus = pgEnum("booking_status", ["active", "cancelled", "completed"]);
export const paymentMethod = pgEnum("payment_method", ["card", "e-wallet", "bank-transfer"]);

export const lodging = pgTable("lodging", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  type: lodgingType("type").notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  address: varchar("address", { length: 300 }).notNull(),
  tagline: varchar("tagline", { length: 200 }),
  description: text("description").notNull(),
  amenities: text("amenities").array().notNull().default(sql`'{}'::text[]`),
  checkInTime: varchar("check_in_time", { length: 10 }).notNull().default("14:00"),
  checkOutTime: varchar("check_out_time", { length: 10 }).notNull().default("12:00"),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [index("lodging_type_idx").on(t.type)]);

export const lodgingImage = pgTable("lodging_image", {
  id: serial("id").primaryKey(),
  lodgingId: integer("lodging_id").notNull().references(() => lodging.id, { onDelete: "cascade" }),
  storageKey: varchar("storage_key", { length: 300 }).notNull(),
  alt: varchar("alt", { length: 200 }).notNull().default(""),
  isCover: boolean("is_cover").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const roomType = pgTable("room_type", {
  id: serial("id").primaryKey(),
  lodgingId: integer("lodging_id").notNull().references(() => lodging.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  bed: varchar("bed", { length: 60 }).notNull(),
  sizeSqm: integer("size_sqm").notNull(),
  maxPersons: integer("max_persons").notNull(),
  pricePerNight: numeric("price_per_night", { precision: 10, scale: 2 }).notNull(),
  imageKey: varchar("image_key", { length: 300 }),
}, (t) => [check("max_persons_positive", sql`${t.maxPersons} > 0`)]);

export const room = pgTable("room", {
  id: serial("id").primaryKey(),
  lodgingId: integer("lodging_id").notNull().references(() => lodging.id, { onDelete: "cascade" }),
  roomTypeId: integer("room_type_id").notNull().references(() => roomType.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 10 }).notNull(),
  floor: integer("floor").notNull(),
}, (t) => [uniqueIndex("room_number_per_lodging").on(t.lodgingId, t.number)]);

export const discount = pgTable("discount", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  percentOff: integer("percent_off").notNull(),
  description: varchar("description", { length: 200 }).notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
}, (t) => [check("percent_range", sql`${t.percentOff} between 1 and 90`)]);

export const booking = pgTable("booking", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 20 }).notNull().unique(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  roomId: integer("room_id").notNull().references(() => room.id),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  adults: integer("adults").notNull(),
  children: integer("children").notNull().default(0),
  guestName: varchar("guest_name", { length: 200 }).notNull(),
  contactNumber: varchar("contact_number", { length: 30 }).notNull(),
  discountCode: varchar("discount_code", { length: 40 }),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: bookingStatus("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  index("booking_room_dates_idx").on(t.roomId, t.checkIn, t.checkOut),
  check("dates_order", sql`${t.checkOut} > ${t.checkIn}`),
]);

// Demo-only payment record. No real gateway is called.
export const payment = pgTable("payment", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => booking.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  method: paymentMethod("method").notNull(),
  mockReference: varchar("mock_reference", { length: 40 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const review = pgTable("review", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  lodgingId: integer("lodging_id").notNull().references(() => lodging.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 100 }).notNull(),
  rating: integer("rating").notNull(),
  comment: varchar("comment", { length: 1000 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("one_review_per_user_lodging").on(t.userId, t.lodgingId),
  check("rating_range", sql`${t.rating} between 1 and 5`),
]);

export const favorite = pgTable("favorite", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  lodgingId: integer("lodging_id").notNull().references(() => lodging.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [uniqueIndex("favorite_unique").on(t.userId, t.lodgingId)]);
