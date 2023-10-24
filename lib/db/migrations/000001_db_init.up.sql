-- Up Migration Script

-- Users Table
CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "hashed_password" varchar NOT NULL,
  "password_changed_at" timestamptz NOT NULL DEFAULT (now()),
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
  "description" text NOT NULL,
  "general_email" varchar NOT NULL,
  "dispute_email" varchar NOT NULL DEFAULT '',
  "phone_number" varchar NOT NULL DEFAULT '',
  "address" varchar NOT NULL DEFAULT '',
  "city" varchar NOT NULL DEFAULT '',
  "state" varchar NOT NULL DEFAULT '',
  "postal_code" varchar NOT NULL DEFAULT '',
  "country" varchar NOT NULL DEFAULT '',
  "website_url" varchar NOT NULL DEFAULT '',
  "completed_onboarding" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "is_active" boolean NOT NULL DEFAULT true
);

ALTER TABLE "businesses" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE CASCADE;

-- SessionTokens Table
CREATE TABLE "session_tokens" (
  "id" uuid PRIMARY KEY,
  "user_id" bigint NOT NULL,
  "token" varchar NOT NULL,
  "scope" varchar NOT NULL,
  "is_blocked" boolean NOT NULL DEFAULT false,
  "extra_details" jsonb NOT NULL DEFAULT '{}',
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
ALTER TABLE "session_tokens" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION delete_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Accounts Table
CREATE TABLE "accounts" (
  "id" bigserial PRIMARY KEY,
  "business_id" uuid NOT NULL,
  "currency" varchar NOT NULL,
  "balance" NUMERIC(18) NOT NULL, -- total in sats
  "balance_ln" NUMERIC(9) NOT NULL, -- balance in lightning wallet, initialise to zero
  "balance_btc" INTEGER NOT NULL, -- balance in BTC wallet, initialise to zero
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "accounts" ADD FOREIGN KEY ("business_id") REFERENCES "businesses" ("id") ON DELETE CASCADE;

-- Invoices Table
CREATE TABLE "invoices" (
  "id" uuid PRIMARY KEY,
  "invoice_id" varchar UNIQUE NOT NULL,
  "account_id" bigint NOT NULL,
  "amount" NUMERIC(18) NOT NULL, -- in sats
  "amount_local_cur" NUMERIC(18) NOT NULL, -- value in local currency at time of creation, should change to the value at time of payment
  "currency_symbol" varchar NOT NULL,
  "description" TEXT NOT NULL,
  "status" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "invoices" ADD FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE CASCADE;

-- Inbound_transactions Table
CREATE TABLE "inbound_transactions" (
  "id" uuid PRIMARY KEY,
  "invoice_id" uuid NOT NULL,
  "amount" NUMERIC(18, 2) NOT NULL,
  "send_address" varchar, -- can be null if payment was made through lightning
  "recieve_address" varchar, -- can be null if payment was made through lightning
  "payment_method" varchar NOT NULL, -- Lightning or bitcoin
  "currency_symbol" varchar NOT NULL,
  "transaction_fee" NUMERIC(12) NOT NULL, -- in sats
  "conversion_fee" NUMERIC(12) NOT NULL, -- in sats
  "description" TEXT NOT NULL,
  "transaction_type" varchar NOT NULL, -- what is this for?
  "transaction_ref_id" varchar NOT NULL,
  "status" varchar NOT NULL, -- confirmed or not confirmed? only relevant in Bitcoin. Lightning is instant 
  "label" varchar, -- for identifying lightning invoice
  "payment_hash" varchar, -- for lightning
  "txid" varchar, -- for bitcoin
  "amount_local_cur" INTEGER NOT NULL, -- value in local currency at time of reciept
  "account_balance_snapshot" NUMERIC(18, 2) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "inbound_transactions" ADD FOREIGN KEY ("invoice_id") REFERENCES "invoices" ("id") ON DELETE CASCADE;

-- Outbound_transactions Table
CREATE TABLE "outbound_transactions" (
  "id" uuid PRIMARY KEY,
  "amount" NUMERIC(18, 2) NOT NULL,
  "from_account_id" bigint NOT NULL,
  "to_destination" varchar NOT NULL, -- Store destination information (e.g., wallet address, bank account number)
  "currency_symbol" varchar NOT NULL,
  "transaction_fee" NUMERIC(10, 2) NOT NULL,
  "conversion_fee" NUMERIC(10, 2) NOT NULL,
  "description" TEXT NOT NULL,
  "transaction_type" varchar NOT NULL, -- Type of outbound transaction (e.g., "crypto_transfer", "bank_withdrawal")
  "transaction_ref_id" varchar NOT NULL,
  "status" varchar NOT NULL,
  "transaction_hash" varchar NOT NULL,
  "account_balance_snapshot" NUMERIC(18, 2) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "outbound_transactions" ADD FOREIGN KEY ("from_account_id") REFERENCES "accounts" ("id") ON DELETE CASCADE;
