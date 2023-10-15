/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from "../../logger/logger";
import sql from "../db";
import { v4 as uuidv4 } from "uuid"; 

export interface Business {
  id: string;
  about: string;
  email: string;
  profile_image_url?: string | null;
  hashed_password: string;
  password_changed_at: Date;
  created_at: Date;
  is_active: boolean;
  is_email_verified: boolean;
}

export interface InsertParams {
  about: string;
  email: string;
  profileImageUrl: string;
  hashedPassword: string;
}

export async function insertBusiness({about, email, profileImageUrl, hashedPassword}: InsertParams) {
	try {
		const newId = uuidv4();
		const res = await sql`
    INSERT INTO businesses (
      id, about, email, profile_image_url, hashed_password
    ) VALUES (${newId}, ${about}, ${email}, ${profileImageUrl}, ${hashedPassword})
    RETURNING *`;
		return res;
	} catch (error: any) {
		logger.error(error.message);
	}
}