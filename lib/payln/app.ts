import express, { Express } from "express";
import http from "http";
import { AddressInfo } from "net";
import { Server } from "http";
import { Configs } from "../utils/config";
import businessRouter from "./routes/business";
import cookieParser from "cookie-parser";

export class Payln {
	private app: Express;
	private server: Server;
	private readonly configs: Configs;

	constructor(configs: Configs) {
		this.app = express();
		this.server = http.createServer(this.app);
		this.configs = configs;
	}

	private setupRoutes(): void {
		// Body parser, reading data from body into req.body
		this.app.use(express.json({ limit: "10kb" }));
		this.app.use(express.urlencoded({ extended: true, limit: "10kb" }));
		this.app.use(cookieParser());

		// Define your Express routes here
		this.app.use("/api/v1/business", businessRouter);
	}

	public async start(): Promise<void> {
		this.setupRoutes();

		this.server.listen(this.configs.Port, () => {
			const { port } = this.server.address() as AddressInfo;
			console.log(`Server is running on port ${port}`);
		});

		const shutdown = async (): Promise<void> => {
			console.log("Shutdown started");

			this.server.close(async () => {
				console.log("Server is gracefully shutting down");
				// Perform any necessary cleanup or background tasks here
				console.log("Server shutdown completed");
				process.exit(0);
			});
		};

		process.on("SIGINT", shutdown);
		process.on("SIGTERM", shutdown);
	}
}

