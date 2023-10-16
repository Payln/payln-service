ALTER TABLE "businesses" DROP CONSTRAINT IF EXISTS businesses_owner_id_fkey;

DROP TABLE IF EXISTS "businesses";
DROP TABLE IF EXISTS "users";