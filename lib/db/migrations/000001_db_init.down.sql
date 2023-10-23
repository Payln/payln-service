-- Down Migration Script

-- Remove Foreign Keys
ALTER TABLE "outbound_transactions" DROP CONSTRAINT IF EXISTS "outbound_transactions_from_account_id_fkey";
ALTER TABLE "inbound_transactions" DROP CONSTRAINT IF EXISTS "inbound_transactions_invoice_id_fkey";
ALTER TABLE "invoices" DROP CONSTRAINT IF EXISTS "invoices_account_id_fkey";
ALTER TABLE "accounts" DROP CONSTRAINT IF EXISTS "accounts_business_id_fkey";
ALTER TABLE "session_tokens" DROP CONSTRAINT IF EXISTS "session_tokens_user_id_fkey";
ALTER TABLE "businesses" DROP CONSTRAINT IF EXISTS "businesses_owner_id_fkey";

-- Drop Tables
DROP TABLE IF EXISTS "outbound_transactions";
DROP TABLE IF EXISTS "inbound_transactions";
DROP TABLE IF EXISTS "invoices";
DROP TABLE IF EXISTS "accounts";
DROP TABLE IF EXISTS "session_tokens";
DROP TABLE IF EXISTS "businesses";
DROP TABLE IF EXISTS "users";

-- Drop Function
DROP FUNCTION IF EXISTS delete_expired_sessions();
