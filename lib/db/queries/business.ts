/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import { PostgresError } from "postgres";
import sql from "../db";

export interface InsertParams {
  name: string;
  description: string;
  email: string;
  profileImageUrl: string;
  hashedPassword: string;
}

export async function insertBusiness({ name, description, email, profileImageUrl, hashedPassword }: InsertParams) {
  try {
    const newId = uuidv4();
    const [business]: [Business?] = await sql`
    INSERT INTO businesses (
      id, name, description, general_email, profile_image_url, hashed_password
    ) VALUES (${newId}, ${name}, ${description}, ${email}, ${profileImageUrl}, ${hashedPassword})
    RETURNING *`;
    return business;
  } catch (error: any) {
    if (error instanceof PostgresError) {
      const dbErrMsg = error.message;
      throw new Error(`insertion failed on '${dbErrMsg}'`);
    } else {
      throw error;
    }
  }
}
