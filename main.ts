import { Payln } from "./lib/payln/app";
import { configs } from "./lib/utils/config";

const app = new Payln(configs);

app.start().catch((error) => {
	console.error("Error starting server:", error);
});
