import { HeadersInit } from "node-fetch";
import { AuthenticationParameters } from "../types/AuthenticationParameters.js";
import { defaultHeaders } from "./defaultHeaders.js";
import { getAccessToken } from "./getAccessToken.js";

export async function getAuthenticatedHeaders(
  authParams: AuthenticationParameters
): Promise<HeadersInit> {
  const accessToken = await getAccessToken(authParams);
  return {
    Authorization: `Bearer ${accessToken}`,
    ...defaultHeaders,
  };
}
