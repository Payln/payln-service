/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import { V3 } from "paseto";
import { configs } from "../utils/config";
import { afterTime } from "../utils/random";

const { encrypt, decrypt } = V3;

export interface Payload {
  id: string;
  user_id: number;
  email: string;
  extra: any;
  expired_at: Date;
  iat: Date;
}

export const ErrInvalidToken = new Error("token is invalid");
export const ErrExpiredToken = new Error("token has expired");

class PasetoMaker {
  private symmetricKey: Buffer;

  constructor(symmetricKey: string) {
    if (symmetricKey.length !== 32) {
      throw new Error("Invalid key size: must be exactly 32 characters");
    }
    this.symmetricKey = Buffer.from(symmetricKey);
  }

  async createToken(
    userID: number,
    email: string,
    duration: number,
    extra: any
  ): Promise<{ token: string; payload: Payload }> {
    const newId = uuidv4();
    const payload = {
      id: newId,
      user_id: userID,
      email,
      extra,
      expired_at: new Date(Date.now() + duration * 60 * 1000),
      iat: new Date(Date.now())
    };

    const token = await encrypt(payload, this.symmetricKey);

    return { token, payload };
  }

  async verifyToken(token: string): Promise<Payload> {
    let payload: Payload;
    try {
      payload = await decrypt(token, this.symmetricKey);
    } catch (error) {
      throw ErrInvalidToken;
    }

    if (afterTime(new Date(payload.expired_at))) {
      throw ErrExpiredToken;
    }

    return payload;
  }
}

const pasetoMaker = new PasetoMaker(configs.TokenSymmetricKey);

export default pasetoMaker;