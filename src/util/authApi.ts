import nodeFetch, { RequestInit } from "node-fetch";
import { AuthenticationParameters } from "../types/AuthenticationParameters.js";
import { CreateRecordResult } from "../types/CreateRecordResult.js";
import { RetrieveMultipleRecordsResponse } from "../types/RetrieveMultipleRecordsResponse.js";
import { Row } from "../types/Row.js";
import { getApiBaseUrl } from "./getApiBaseUrl.js";
import { getAuthenticatedHeaders } from "./getAuthenticatedHeaders.js";
import { getCollectionName } from "./getCollectionName.js";
import { mergeHeadersIntoRequestOptions } from "./mergeHeadersIntoRequestOptions.js";

export async function createRecord<TRecord extends Row>(
  entityLogicalName: string,
  data: TRecord,
  authParams: AuthenticationParameters
) {
  const collectionName = await getCollectionName(
    entityLogicalName,
    fetch,
    authParams
  );
  const response = await fetch(
    collectionName,
    { body: JSON.stringify(data), method: "POST" },
    authParams
  );
  if (response.ok) {
    const entityIdUrl = response.headers.get("odata-entityid")!;
    const entityIdTest = /\(([0-9a-z\-]*)\)$/.exec(entityIdUrl)!;
    const id = entityIdTest[1]!;
    return { entityType: entityLogicalName, id };
  } else {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

export async function retrieveMultipleRecords<TRecord extends Row>(
  entityLogicalName: string,
  options?: string,
  maxPageSize?: number,
  authParams?: AuthenticationParameters
) {
  const collectionName = await getCollectionName(
    entityLogicalName,
    fetch,
    authParams
  );
  const response = await fetch(
    `${collectionName}${options ?? ""}`,
    {
      ...(maxPageSize && {
        headers: { Prefer: `odata.maxpagesize=${maxPageSize}` },
      }),
      method: "GET",
    },
    authParams
  );
  if (response.ok) {
    const payload =
      (await response.json()) as RetrieveMultipleRecordsResponse<TRecord>;
    return payload.value;
  } else {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

export async function retrieveRecord<TRecord extends Row>(
  entityLogicalName: string,
  id: string,
  options?: string,
  authParams?: AuthenticationParameters
) {
  const collectionName = await getCollectionName(
    entityLogicalName,
    fetch,
    authParams
  );
  const response = await fetch(
    `${collectionName}(${id})${options ?? ""}`,
    { method: "GET" },
    authParams
  );
  if (response.ok) {
    return (await response.json()) as TRecord;
  } else {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

export async function fetch(
  url: string,
  options?: RequestInit,
  authParams?: AuthenticationParameters
) {
  const headers = await getAuthenticatedHeaders(authParams!);
  const apiBaseUrl = getApiBaseUrl(authParams!.environmentUrl);
  return nodeFetch(
    `${apiBaseUrl}${url}`,
    mergeHeadersIntoRequestOptions(headers, options)
  );
}
