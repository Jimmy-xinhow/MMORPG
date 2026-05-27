import path from "node:path";
import { resetStore } from "../src/storage.js";

const dataFile = process.env.DATA_FILE ?? path.join(process.cwd(), "data", "dev-store.json");
resetStore(dataFile, { seed: false });
console.log(`Reset dev data: ${dataFile}`);
