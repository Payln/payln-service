-- Up Migration Script

-- Users Table
CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "hashed_password" varchar NOT NULL,
  "password_changed_at" timestamptz NOT NULL DEFAULT '0001-01-01 00:00:00Z',
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "is_active" boolean NOT NULL DEFAULT true,
  "is_email_verified" boolean NOT NULL DEFAULT false
);

-- Businesses Table
CREATE TABLE "businesses" (
  "id" uuid PRIMARY KEY,
  "owner_id" bigint NOT NULL,
  "name" varchar NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "general_email" varchar UNIQUE NOT NULL,
  "dispute_email" varchar UNIQUE NOT NULL,
  "phone_number" varchar NOT NULL DEFAULT '',
  "address" varchar NOT NULL DEFAULT '',
  "city" varchar NOT NULL DEFAULT '',
  "state" varchar NOT NULL DEFAULT '',
  "postal_code" varchar NOT NULL DEFAULT '',
  "country" varchar NOT NULL DEFAULT '',
  "website_url" varchar NOT NULL DEFAULT '',
  "profile_image_url" varchar NOT NULL DEFAULT '',
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "is_active" boolean NOT NULL DEFAULT true
);

ALTER TABLE "businesses" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE CASCADE;
