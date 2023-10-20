import express, { Express } from "express";
import http from "http";
import { AddressInfo } from "net";
import { Server } from "http";
import { Configs } from "../utils/config";
import businessRouter from "./routes/business";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import logger from "../logger/logger";
import sql from "../db/db";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";
import rateLimit from "express-rate-limit";
import compression from "compression";
import {  emailWorker } from "../bg_workers/send_email_worker";
import { redisConn } from "../bg_workers/worker";
import authRouter from "./routes/auth";
import { healthCheckHandler } from "./controllers/healthcheck";
import userRouter from "./routes/users";

// read and parse swagger yaml file
const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

export class Payln {
	public app: Express;
	private server: Server;
	private readonly configs: Configs;

	constructor(configs: Configs) {
		this.app = express();
		this.server = http.createServer(this.app);
		this.configs = configs;

		this.setupRoutes();
	}

	private setupRoutes(): void {
		this.app.use(express.json({ limit: "1mb" }));
		this.app.use(cookieParser());
		this.app.use(cors());
		this.app.use(helmet());
		this.app.use(compression());
		this.app.set("trust proxy", 1);
		if (this.configs.Env === "development" || this.configs.Env === "staging") {
			this.app.use(morgan("dev"));
		}

		const limiter = rateLimit({
			max: 10,
			windowMs: 60 * 1000, // 1 minute
			message: "too many requests from this IP, please try again in a minute!"
		});
		this.app.use("/", limiter);
		this.app.get("/", healthCheckHandler);

		// swagger docs files
		this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
		// Express routes here
		this.app.use("/businesses", businessRouter);
		this.app.use("/auth", authRouter);
		this.app.use("/users", userRouter);

		this.app.all("*", (req, res) => {
			return res.status(404).json({
				status: "error",
				message: `resource,${req.originalUrl}, doesn't exist`,
			});
		});
	}

	public async start(): Promise<void> {

		

		this.server.listen(this.configs.Port, () => {
			const { port } = this.server.address() as AddressInfo;
			logger.info(`Server is running on port ${port}`);
		});

		const shutdown = async (): Promise<void> => {
			console.log("Shutdown started");

			this.server.close(async () => {
				logger.info("Server is gracefully shutting down");

				logger.info("closing db connection");
				await sql.end();

				logger.info("closing background worker");
				await emailWorker.close();

				logger.info("closing redis connection");
				redisConn.quit();

				logger.info("Server shutdown completed");
				process.exit(0);
			});
		};

		process.on("SIGINT", shutdown);
		process.on("SIGTERM", shutdown);
	}
}

