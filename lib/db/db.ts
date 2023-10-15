import postgres from "postgres";
import { configs } from "../utils/config";

const sql = postgres(configs.DBSource);

export default sql;