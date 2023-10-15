import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: "secrets.env" }); // Load environment variables from .env file

interface Limiter {
  RPS: number;
  Burst: number;
  Enabled: boolean;
}

export interface Configs {
  Env: string;
  ServerAddr: string;
  Port: number;
  APIHost: string;
  CorsTrustedOrigins: string[];
  DBSource: string;
  EmailSenderAddress: string;
  EmailSenderName: string;
  EmailSenderPassword: string;
  TokenSymmetricKey: string;
  RedisAddress: string;
  MigrationURL: string;
  Limiter: Limiter;
}

export const configs: Configs = {
	Env: process.env.ENVIRONMENT || "development",
	ServerAddr: process.env.SERVER_ADDRESS || "localhost:3000",
	Port: parseInt(process.env.PORT || "6780", 10),
	APIHost: process.env.APIHOST || "http://localhost:3000",
	CorsTrustedOrigins: (process.env.CORS_TRUSTED_ORIGINS || "").split(","),
	DBSource: process.env.DB_SOURCE || "your-database-connection-string",
	EmailSenderAddress: process.env.EMAIL_SENDER_ADDRESS || "",
	EmailSenderName: process.env.EMAIL_SENDER_NAME || "",
	EmailSenderPassword: process.env.EMAIL_SENDER_PASSWORD || "",
	TokenSymmetricKey: process.env.TOKEN_SYMMETRIC_KEY || "",
	RedisAddress: process.env.REDIS_ADDRESS || "localhost:6379",
	MigrationURL: process.env.MIGRATION_URL || "",
	Limiter: {
		RPS: parseFloat(process.env.LIM_RPS || "10"),
		Burst: parseInt(process.env.LIM_BURST || "20", 10),
		Enabled: process.env.LIM_ENABLED === "true",
	},
};
