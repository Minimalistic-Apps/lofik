import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL env variable must be defined.");
}

import { execSync } from "child_process";
import path from "path";

const libPath = path.resolve(__dirname, "../");

execSync("npm run generate", { cwd: libPath });
execSync("npm run migrate", { cwd: libPath });

export { startLofikServer } from "./startLofikServer";
