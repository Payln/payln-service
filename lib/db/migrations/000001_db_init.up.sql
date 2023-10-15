CREATE TABLE "businesses" (
  "id" uuid PRIMARY KEY,
  "about" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "profile_image_url" varchar,
  "hashed_password" varchar NOT NULL,
  "password_changed_at" timestamptz NOT NULL DEFAULT '0001-01-01 00:00:00Z',
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "is_active" boolean NOT NULL DEFAULT true,
  "is_email_verified" boolean NOT NULL DEFAULT false
);