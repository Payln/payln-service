/* eslint-disable @typescript-eslint/no-explicit-any */
import { PostgresError } from "postgres";
import sql from "../../db/db";
import { v4 as uuidv4 } from "uuid";

class SessionToken {
  async createSessionToken({
    user_id,
    token,
    scope,
    expires_at,
    extra_details = {},
  }: CreateSessionTokenParams) {
    try {
      const newId = uuidv4();

      const [sessionToken]: [ISessionToken?] = await sql`
        INSERT INTO session_tokens (
          id, user_id, token, scope, extra_details, expires_at
        ) VALUES (${newId}, ${user_id}, ${token}, ${scope}, ${sql.json(extra_details)}, ${expires_at})
        RETURNING *;
      `;
      return sessionToken;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`Insertion failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }

  async getSessionToken(id: string) {
    try {
      const [sessionToken]: [ISessionToken?] = await sql`
        SELECT * FROM session_tokens WHERE id = ${id} LIMIT 1;
      `;
      return sessionToken;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`Query failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }

  async checkSessionTokenExists(token: string, scope: string) {
    try {
      const [result]: [CheckSessionResult] = await sql`
        SELECT EXISTS(SELECT 1 FROM session_tokens WHERE token = ${token} AND scope = ${scope}) AS session_exists;
      `;
      return result.session_exists;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`Query failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }

  async deleteExpiredSessionTokens() {
    try {
      await sql`
      SELECT delete_expired_sessions();
      `;
    } catch (error) {
      if (error instanceof PostgresError) {
        const dbErrMsg = error.message;
        throw new Error(`Deletion failed on '${dbErrMsg}'`);
      } else {
        throw error;
      }
    }
  }
}

const sessionTokenClass = new SessionToken();

export default sessionTokenClass;

