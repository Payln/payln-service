/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";

// HashedPassword returns the bcrypt hash of the password
export async function hashedPassword(password: string): Promise<string> {
  try {
    const hashedPassword: string = await bcrypt.hash(password, bcrypt.genSaltSync(10));
    return hashedPassword;
  } catch (error: any) {
    throw new Error(`Failed to hash password: ${error.message}`);
  }
}

// CheckPassword checks if the provided password is correct or not
export async function checkPassword(password: string, hashPassword: string): Promise<void> {
  try {
    await bcrypt.compare(password, hashPassword);
  } catch (error: any) {
    throw new Error(`Password check failed: ${error.message}`);
  }
}
