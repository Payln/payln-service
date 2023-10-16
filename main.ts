import { Payln } from "./lib/payln/app";
import { configs } from "./lib/utils/config";

const payln = new Payln(configs);

payln.start().catch((error) => {
	console.error("Error starting server:", error);
});
