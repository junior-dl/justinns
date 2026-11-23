CREATE TYPE "public"."booking_status" AS ENUM('active', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."lodging_type" AS ENUM('hotel', 'inn', 'pension');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('card', 'e-wallet', 'bank-transfer');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'guest' NOT NULL,
	"phone" text,
	"address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" varchar(20) NOT NULL,
	"user_id" text NOT NULL,
	"room_id" integer NOT NULL,
	"check_in" date NOT NULL,
	"check_out" date NOT NULL,
	"adults" integer NOT NULL,
	"children" integer DEFAULT 0 NOT NULL,
	"guest_name" varchar(200) NOT NULL,
	"contact_number" varchar(30) NOT NULL,
	"discount_code" varchar(40),
	"subtotal" numeric(10, 2) NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"status" "booking_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "booking_reference_unique" UNIQUE("reference"),
	CONSTRAINT "dates_order" CHECK ("booking"."check_out" > "booking"."check_in")
);
--> statement-breakpoint
CREATE TABLE "discount" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(40) NOT NULL,
	"percent_off" integer NOT NULL,
	"description" varchar(200) DEFAULT '' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "discount_code_unique" UNIQUE("code"),
	CONSTRAINT "percent_range" CHECK ("discount"."percent_off" between 1 and 90)
);
--> statement-breakpoint
CREATE TABLE "favorite" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lodging_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lodging" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(120) NOT NULL,
	"type" "lodging_type" NOT NULL,
	"city" varchar(80) NOT NULL,
	"address" varchar(300) NOT NULL,
	"tagline" varchar(200),
	"description" text NOT NULL,
	"amenities" text[] DEFAULT '{}'::text[] NOT NULL,
	"check_in_time" varchar(10) DEFAULT '14:00' NOT NULL,
	"check_out_time" varchar(10) DEFAULT '12:00' NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lodging_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lodging_image" (
	"id" serial PRIMARY KEY NOT NULL,
	"lodging_id" integer NOT NULL,
	"storage_key" varchar(300) NOT NULL,
	"alt" varchar(200) DEFAULT '' NOT NULL,
	"is_cover" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"method" "payment_method" NOT NULL,
	"mock_reference" varchar(40) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lodging_id" integer NOT NULL,
	"title" varchar(100) NOT NULL,
	"rating" integer NOT NULL,
	"comment" varchar(1000) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rating_range" CHECK ("review"."rating" between 1 and 5)
);
--> statement-breakpoint
CREATE TABLE "room" (
	"id" serial PRIMARY KEY NOT NULL,
	"lodging_id" integer NOT NULL,
	"room_type_id" integer NOT NULL,
	"number" varchar(10) NOT NULL,
	"floor" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"lodging_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"bed" varchar(60) NOT NULL,
	"size_sqm" integer NOT NULL,
	"max_persons" integer NOT NULL,
	"price_per_night" numeric(10, 2) NOT NULL,
	"image_key" varchar(300),
	CONSTRAINT "max_persons_positive" CHECK ("room_type"."max_persons" > 0)
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_lodging_id_lodging_id_fk" FOREIGN KEY ("lodging_id") REFERENCES "public"."lodging"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lodging_image" ADD CONSTRAINT "lodging_image_lodging_id_lodging_id_fk" FOREIGN KEY ("lodging_id") REFERENCES "public"."lodging"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_lodging_id_lodging_id_fk" FOREIGN KEY ("lodging_id") REFERENCES "public"."lodging"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_lodging_id_lodging_id_fk" FOREIGN KEY ("lodging_id") REFERENCES "public"."lodging"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_room_type_id_room_type_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_type" ADD CONSTRAINT "room_type_lodging_id_lodging_id_fk" FOREIGN KEY ("lodging_id") REFERENCES "public"."lodging"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booking_room_dates_idx" ON "booking" USING btree ("room_id","check_in","check_out");--> statement-breakpoint
CREATE UNIQUE INDEX "favorite_unique" ON "favorite" USING btree ("user_id","lodging_id");--> statement-breakpoint
CREATE INDEX "lodging_type_idx" ON "lodging" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "one_review_per_user_lodging" ON "review" USING btree ("user_id","lodging_id");--> statement-breakpoint
CREATE UNIQUE INDEX "room_number_per_lodging" ON "room" USING btree ("lodging_id","number");