import { env } from "process";

export function getEnvValue(...names: string[]) {
  for (const name of names) {
    const value = env[name];
    if (value) {
      return value;
    }
  }
}
