import { env } from "process";
import { ConfidentialClientApplication } from "@azure/msal-node";
import {
  Api,
  CreateRecordResult,
  RetrieveMultipleRecordsResponse,
} from "../types/Api.js";
import { AuthenticationParameters } from "../types/AuthenticationParameters.js";
import { Record } from "../types/Record.js";
import fetch from "node-fetch";
import { createCollectionNameCache } from "./createCollectionNameCache.js";

export default function getEnvApi(): Api {
  const authParams = getAuthenticationParameters();
  const accessTokenPromise = getAccessToken(authParams);

  const { environmentUrl } = authParams;

  const collectionNameCache = createCollectionNameCache(retrieveRecord);

  return {
    createRecord,
    retrieveMultipleRecords,
    retrieveRecord,
  };

  async function createRecord<TRecord extends Record>(
    entityLogicalName: string,
    data: TRecord
  ): Promise<CreateRecordResult> {
    const [collectionName, headers] = await Promise.all([
      collectionNameCache.getCollectionName(entityLogicalName),
      getHeaders(),
    ]);
    const postUrl = `${environmentUrl}api/data/v9.2/${collectionName}`;
    const response = await fetch(postUrl, {
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

  async function retrieveMultipleRecords<TRecord extends Record>(
    entityLogicalName: string,
    options?: string,
    maxPageSize?: number
  ): Promise<TRecord[]> {
    const [collectionName, headers] = await Promise.all([
      collectionNameCache.getCollectionName(entityLogicalName),
      getHeaders(),
    ]);
    const baseUrl = `${environmentUrl}api/data/v9.2/${collectionName}`;
    const getUrl = options ? `${baseUrl}${options}` : baseUrl;
    if (maxPageSize) {
      headers.Prefer = `odata.maxpagesize=${maxPageSize}`;
    }
    const response = await fetch(getUrl, {
      method: "GET",
      headers,
    });
    const contents =
      (await response.json()) as RetrieveMultipleRecordsResponse<TRecord>;
    return contents.value;
  }

  async function retrieveRecord<TRecord extends Record>(
    entityLogicalName: string,
    id: string,
    options?: string
  ): Promise<TRecord>;
  async function retrieveRecord<TRecord extends Record>(
    entityLogicalName: string,
    keyValuePair: { key: string; value: string },
    options?: string
  ): Promise<TRecord>;
  async function retrieveRecord<TRecord extends Record>(
    entityLogicalName: string,
    arg1: string | { key: string; value: string },
    options?: string
  ): Promise<TRecord> {
    const [collectionName, headers] = await Promise.all([
      collectionNameCache.getCollectionName(entityLogicalName),
      getHeaders(),
    ]);
    const baseUrl = `${environmentUrl}api/data/v9.2/${collectionName}`;
    const entityUrl =
      typeof arg1 === "string"
        ? `${baseUrl}(${arg1})`
        : `${baseUrl}(${arg1.key}='${arg1.value}')`;
    const getUrl = options ? `${entityUrl}${options}` : entityUrl;
    const response = await fetch(getUrl, {
      method: "GET",
      headers,
    });
    const record = (await response.json()) as TRecord;
    return record;
  }

  async function getHeaders(): Promise<Headers> {
    const accessToken = await accessTokenPromise;
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      Accept: "application/json",
    };
  }

  interface Headers {
    [key: string]: string;
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
