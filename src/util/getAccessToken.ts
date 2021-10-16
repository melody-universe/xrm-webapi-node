import { ConfidentialClientApplication } from "@azure/msal-node";
import { AuthenticationParameters } from "../types/AuthenticationParameters.js";

const cache: AccessTokenCache = {};

export async function getAccessToken(authParams: AuthenticationParameters) {
  const paramsHash = JSON.stringify(authParams);
  if (!(paramsHash in cache)) {
    const {
      environmentUrl,
      credentials: { authority, clientId, clientSecret, tenantId },
    } = authParams;
    const app = new ConfidentialClientApplication({
      auth: { clientId, clientSecret, authority: `${authority}${tenantId}` },
    });
    const response = await app.acquireTokenByClientCredential({
      scopes: [`${environmentUrl}.default`],
    });
    if (response === null) {
      throw new Error("MSAL authentication returned a null response.");
    }
    cache[paramsHash] = response.accessToken;
  }
  return cache[paramsHash];
}

type AccessTokenCache = {
  [key: string]: string;
};
