import { getEnvValue } from "./getEnvValue.js";

export function getRequiredEnvValue(...names: string[]) {
  const value = getEnvValue(...names);
  if (value === undefined) {
    throw new Error(
      `Missing required environment variable: ${names.join(" or ")}`
    );
  }
  return value;
}
