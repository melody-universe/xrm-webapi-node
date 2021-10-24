import { env } from "process";

export function getRequiredEnvValue(...names: string[]) {
  for (const name of names) {
    const value = env[name];
    if (value) {
      return value;
    }
  }
  throw new Error(
    `Missing required environment variable: ${names.join(" or ")}`
  );
}
