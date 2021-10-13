import { env } from "process";
import { ConfidentialClientApplication } from "@azure/msal-node";
import { RetrieveMultipleRecordsResponse } from "../../types/RetrieveMultipleRecordsResponse";
import { CreateRecordResult } from "../../types/CreateRecordResult";
import { AuthenticationParameters } from "../../types/AuthenticationParameters.js";
import { Row } from "../../types/Row.js";
import fetch, { HeadersInit } from "node-fetch";
import { createCollectionNameLookup } from "../createCollectionNameLookup.js";
import { Api } from "../../types/Api.js";

export default function getNodeApi(): Api {
  const authParams = getAuthenticationParameters();
  const headersPromise = getHeaders();

  const { environmentUrl } = authParams;

  const apiBaseUrl = `${environmentUrl.replace(/\/$/, "")}/api/data/v9.2`;

  const collectionNameCache = createCollectionNameLookup(
    apiBaseUrl,
    headersPromise
  );

  return {
    createRecord,
    retrieveMultipleRecords,
    retrieveRecord,
    getApiBaseUrl: () => apiBaseUrl,
  };

  async function createRecord<TRecord extends Row>(
    entityLogicalName: string,
    data: TRecord
  ): Promise<CreateRecordResult> {
    const [collectionName, headers] = await Promise.all([
      collectionNameCache.getCollectionName(entityLogicalName),
      headersPromise,
    ]);
    const requestUrl = `${apiBaseUrl}/${collectionName}`;
    const response = await fetch(requestUrl, {
      headers,
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const entityIdUrl = response.headers.get("odata-entityid")!;
      const entityIdTest = /\(([0-9a-z\-]*)\)$/.exec(entityIdUrl)!;
      const entityId = entityIdTest[1]!;
      return { entityType: entityLogicalName, id: entityId };
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  }

  async function retrieveMultipleRecords<TRecord extends Row>(
    entityLogicalName: string,
    options?: string,
    maxPageSize?: number
  ): Promise<TRecord[]> {
    const [collectionName, headers] = await Promise.all([
      collectionNameCache.getCollectionName(entityLogicalName),
      headersPromise,
    ]);
    const baseUrl = `${apiBaseUrl}/${collectionName}`;
    const getUrl = options ? `${baseUrl}${options}` : baseUrl;
    const response = await fetch(getUrl, {
      method: "GET",
      headers: {
        ...headers,
        ...(maxPageSize ? { Prefer: `odata.maxpagesize=${maxPageSize}` } : []),
      },
    });
    if (response.ok) {
      const payload =
        (await response.json()) as RetrieveMultipleRecordsResponse<TRecord>;
      return payload.value;
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  }

  async function retrieveRecord<TRecord extends Row>(
    entityLogicalName: string,
    id: string,
    options?: string
  ): Promise<TRecord> {
    const [collectionName, headers] = await Promise.all([
      collectionNameCache.getCollectionName(entityLogicalName),
      headersPromise,
    ]);
    const entityBaseUrl = `${apiBaseUrl}/${collectionName}(${id})`;
    const requestUrl = options ? `${entityBaseUrl}${options}` : entityBaseUrl;
    const response = await fetch(requestUrl, {
      method: "GET",
      headers,
    });
    if (response.ok) {
      const record = (await response.json()) as TRecord;
      return record;
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  }

  async function getHeaders(): Promise<HeadersInit> {
    const accessToken = await getAccessToken(authParams);
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      Accept: "application/json",
    };
  }
}

async function getAccessToken(authParams: AuthenticationParameters) {
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
  return response.accessToken;
}

function getAuthenticationParameters(): AuthenticationParameters {
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
