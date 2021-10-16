import { env } from "process";
import { AuthenticationParameters } from "../types/AuthenticationParameters.js";

export function getEnvironmentAuthenticationParameters(): AuthenticationParameters {
  return {
    environmentUrl: getRequiredEnvValue("URL"),
    credentials: {
      authority: env["AUTHORITY"] ?? "https://login.microsoftonline.com/",
      clientId: getRequiredEnvValue("APPLICATION_ID"),
      clientSecret: getRequiredEnvValue("CLIENT_SECRET"),
      tenantId: getRequiredEnvValue("TENANT_ID"),
    },
  };
}

function getRequiredEnvValue(name: string) {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
