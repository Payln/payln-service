import jsSHA from "jssha";
import { configs } from "../utils/config";

class OTPGenerator {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  /**
   * Generate a TOTP (Time-based One-Time Password) code based on the current time.
   * @param {number} timeStep - Time step in seconds (typically 30).
   * @param {number} digits - Number of digits in the OTP code (typically 6 or 8).
   * @returns {string} - TOTP code as a numeric string.
   */
  generateTOTP(timeStep: number = 30, digits: number = 6): string {
    const currentUnixTime: number = Math.floor(Date.now() / 1000);
    const counter: number = Math.floor(currentUnixTime / timeStep);
    return this.generateOTP(counter, digits);
  }

  /**
   * Generate a one-time password (OTP) using the HOTP algorithm.
   * @param {number} counter - Counter value.
   * @param {number} digits - Number of digits in the OTP code (typically 6 or 8).
   * @returns {string} - OTP code as a numeric string.
   */
  private generateOTP(counter: number, digits: number = 6): string {
    const shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.setHMACKey(this.secret, "TEXT");
    shaObj.update(counter.toString(16).padStart(16, "0"));
    const hmac: string = shaObj.getHMAC("HEX");
    const offset: number = parseInt(hmac.substring(hmac.length - 2), 16) & 0x0f;
    const binary: string = (parseInt(hmac.substring(offset * 2, offset * 2 + 8), 16) & 0x7fffffff).toString(10);
    const otp: string = ("0".repeat(digits) + (parseInt(binary, 10) % (10 ** digits))).slice(-digits);
    return otp;
  }
}

const otpGenerator: OTPGenerator = new OTPGenerator(configs.TokenSymmetricKey);

export default otpGenerator;
