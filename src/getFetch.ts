import {
  AuthenticationResult,
  ConfidentialClientApplication,
  PublicClientApplication,
} from "@azure/msal-node";
import fetch, { RequestInit } from "node-fetch";
import { Credentials } from "./types/Credentials.js";
import { Fetch } from "./types/methods/Fetch.js";
import { Merge } from "./types/util/Merge.js";
import { getApiBaseUrl } from "./util/getApiBaseUrl.js";
import { getEnvObject } from "./util/getEnvObject.js";
import { getRequiredEnvValue } from "./util/getRequiredEnvValue.js";

export function getFetch(url?: string, credentials?: Credentials): Fetch;
export function getFetch(
  url?: string,
  credentials?: Partial<Merge<Credentials>>
): Fetch {
  url = getUrl(url);

  const getAuthResult = createGetAuthResult(url, credentials);
  const baseUrl = getApiBaseUrl(url);

  return async (path?: string, options?: RequestInit) => {
    const tokenResponse = await getAuthResult();
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

function getUrl(url?: string) {
  return url ?? getRequiredEnvValue("URL");
}

function createGetAuthResult(
  url: string,
  credentials?: Partial<Merge<Credentials>>
): GetAuthResult {
  if (!url) {
    url = getRequiredEnvValue("URL");
  }
  if (!credentials) {
    credentials = getEnvObject<Merge<Credentials>>({
      clientId: ["APPLICATION_ID", "CLIENT_ID"],
      clientSecret: "CLIENT_SECRET",
      authority: "AUTHORITY",
      tenantId: "TENANT_ID",
      username: "PP_USERNAME",
      password: "PASSWORD",
    });
  }
  const areAllBasicCredentialsPresent = !!(
    credentials.username && credentials.password
  );
  const areAllClientCredentialsPresent = !!(
    credentials.clientId &&
    credentials.clientSecret &&
    (credentials.authority || credentials.tenantId)
  );

  const requiredCredentialsMessage =
    "Need either (username and password) xor (clientId, clientSecret, and (authority xor tenantId)).";
  if (!(areAllBasicCredentialsPresent || areAllClientCredentialsPresent)) {
    throw new Error(
      `Missing required authentication credentials. ${requiredCredentialsMessage}`
    );
  }
  if (
    ((credentials.clientId || credentials.clientSecret) &&
      credentials.password) ||
    (credentials.authority && credentials.tenantId)
  ) {
    throw new Error(
      `Ambiguous authentication credentials. ${requiredCredentialsMessage}`
    );
  }

  const scopes = [`${url.replace(/\/$/, "")}/.default`];

  if (areAllBasicCredentialsPresent) {
    const username = credentials!.username!;
    const password = credentials!.password!;

    const app = new PublicClientApplication({
      auth: {
        authority: "https://login.microsoftonline.com/organizations",
        clientId: "51f81489-12ee-4a9e-aaae-a2591f45987d",
      },
    });
    return () =>
      app.acquireTokenByUsernamePassword({
        username,
        password,
        scopes,
      });
  } else {
    const clientId = credentials!.clientId!;
    const clientSecret = credentials!.clientSecret!;
    const authority =
      credentials!.authority ??
      `https://login.microsoftonline.com/${credentials!.tenantId}`;

    const app = new ConfidentialClientApplication({
      auth: {
        clientId,
        clientSecret,
        authority,
      },
    });
    return () =>
      app.acquireTokenByClientCredential({
        scopes,
      });
  }
}

type GetAuthResult = () => Promise<AuthenticationResult | null>;
