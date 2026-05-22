import { readFileSync } from "node:fs";

export function readJson(absPath) {
  return JSON.parse(readFileSync(absPath, "utf8"));
}
