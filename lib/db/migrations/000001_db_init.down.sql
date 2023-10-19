ALTER TABLE "businesses" DROP CONSTRAINT IF EXISTS businesses_owner_id_fkey;
ALTER TABLE "session_tokens" DROP CONSTRAINT IF EXISTS session_tokens_user_id_fkey;

DROP TABLE IF EXISTS "businesses";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "session_tokens";
DROP FUNCTION IF EXISTS delete_expired_sessions();
