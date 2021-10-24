import { ConfidentialClientApplication } from "@azure/msal-node";
import fetch, { RequestInit } from "node-fetch";
import { env } from "process";
import { ClientCredentials } from "./types/ClientCredentials.js";
import { Fetch } from "./types/methods/Fetch.js";
import { Merge } from "./types/util/Merge.js";
import { getApiBaseUrl } from "./util/getApiBaseUrl.js";
import { getRequiredEnvValue } from "./util/getRequiredEnvValue.js";

export function getFetch(url?: string, credentials?: ClientCredentials): Fetch;
export function getFetch(
  url?: string,
  credentials?: Merge<ClientCredentials>
): Fetch {
  if (!url) {
    url = getRequiredEnvValue("URL");
  }
  if (!credentials) {
    const clientCredentials = {
      clientId: getRequiredEnvValue("APPLICATION_ID", "CLIENT_ID"),
      clientSecret: getRequiredEnvValue("CLIENT_SECRET"),
    };
    const authority = env.AUTHORITY;
    if (authority) {
      credentials = {
        ...clientCredentials,
        authority,
      };
    } else {
      const tenantId = env.TENANT_ID;
      if (tenantId) {
        credentials = {
          ...clientCredentials,
          tenantId,
        };
      } else {
        throw new Error(
          "Missing environment variables AUTHORITY and TENANT_ID (exactly one must be provided)"
        );
      }
    }
  }
  const app = new ConfidentialClientApplication({
    auth: {
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
      authority:
        credentials.authority ??
        `https://login.microsoftonline.com/${credentials.tenantId}`,
    },
  });
  const baseUrl = getApiBaseUrl(url);
  const scopes = [`${url.replace(/\/$/, "")}/.default`];
  return async (path?: string, options?: RequestInit) => {
    const tokenResponse = await app.acquireTokenByClientCredential({
      scopes,
    });
    if (tokenResponse === null) {
      throw new Error("MSAL authentication returned a null response.");
    }
    const token = tokenResponse.accessToken;
    return fetch(`${baseUrl}${path ?? ""}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        ...options?.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
