import nodeFetch, { RequestInit, Response } from "node-fetch";
import { AuthenticationParameters } from "../types/AuthenticationParameters.js";
import { ExecuteRequest } from "../types/methods/Execute.js";
import { Fetch } from "../types/methods/Fetch.js";
import { RetrieveMultipleRecordsResponse } from "../types/methods/RetrieveMultipleRecords.js";
import { Row } from "../types/Row.js";
import { AnyCoalesce } from "../types/util/AnyCoalesce.js";
import { getApiBaseUrl } from "../util/getApiBaseUrl.js";
import { getAuthenticatedHeaders } from "../util/getAuthenticatedHeaders.js";
import { getCollectionName } from "../util/getCollectionName.js";
import { mergeHeadersIntoRequestOptions } from "../util/mergeHeadersIntoRequestOptions.js";

export async function createRecord<TRow extends Row | void = void>(
  authParams: AuthenticationParameters,
  entityLogicalName: string,
  data: AnyCoalesce<TRow>
) {
  const fetch = buildAuthFetch(authParams);
  const collectionName = await getCollectionName(
    entityLogicalName,
    fetch,
    authParams.environmentUrl
  );
  const response = await fetch(collectionName, {
    body: JSON.stringify(data),
    method: "POST",
  });
  if (response.ok) {
    const entityIdUrl = response.headers.get("odata-entityid")!;
    const entityIdTest = /\(([0-9a-z\-]*)\)$/.exec(entityIdUrl)!;
    const id = entityIdTest[1]!;
    return { entityType: entityLogicalName, id };
  } else {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

export function execute(
  authParams: AuthenticationParameters,
  request: ExecuteRequest
): Promise<Response> {
  throw new Error(`execute is not yet implemented. Please use fetch instead.`);
}

export async function retrieveMultipleRecords<TRow extends Row | void = void>(
  authParams: AuthenticationParameters,
  entityLogicalName: string,
  options?: string,
  maxPageSize?: number
) {
  const fetch = buildAuthFetch(authParams);
  const collectionName = await getCollectionName(
    entityLogicalName,
    fetch,
    authParams.environmentUrl
  );
  const response = await fetch(`${collectionName}${options ?? ""}`, {
    ...(maxPageSize && {
      headers: { Prefer: `odata.maxpagesize=${maxPageSize}` },
    }),
    method: "GET",
  });
  if (response.ok) {
    const payload = (await response.json()) as any;
    return { entities: payload.value as AnyCoalesce<TRow>[] };
  } else {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

export async function retrieveRecord<TRow extends Row | void = void>(
  authParams: AuthenticationParameters,
  entityLogicalName: string,
  id: string,
  options?: string
) {
  const fetch = buildAuthFetch(authParams);
  const collectionName = await getCollectionName(
    entityLogicalName,
    fetch,
    authParams.environmentUrl
  );
  const response = await fetch(`${collectionName}(${id})${options ?? ""}`, {
    method: "GET",
  });
  if (response.ok) {
    return (await response.json()) as AnyCoalesce<TRow>;
  } else {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

export async function fetch(
  authParams: AuthenticationParameters,
  path: string,
  options?: RequestInit
) {
  const headers = await getAuthenticatedHeaders(authParams);
  const apiBaseUrl = getApiBaseUrl(authParams.environmentUrl);
  return nodeFetch(
    `${apiBaseUrl}${path}`,
    mergeHeadersIntoRequestOptions(headers, options)
  );
}

function buildAuthFetch(authParams: AuthenticationParameters) {
  return (...args: Parameters<Fetch>) => fetch(authParams, ...args);
}
