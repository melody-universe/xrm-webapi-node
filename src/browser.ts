import nodeFetch, { RequestInit } from "node-fetch";
import { defaultHeaders } from "./util/defaultHeaders.js";
import { getApiBaseUrl } from "./util/getApiBaseUrl.js";
import { getXrmWindow } from "./util/getXrmWindow.js";
import { mergeHeadersIntoRequestOptions } from "./util/mergeHeadersIntoRequestOptions.js";
import { Row } from "./types/Row.js";
import { ExecuteRequest } from "./types/methods/Execute.js";
import { RetrieveMultipleRecordsResponse } from "./types/methods/RetrieveMultipleRecords.js";

export function createRecord<TRow extends Row>(
  entityLogicalName: string,
  data: TRow
) {
  return getXrmWindow().Xrm.WebApi.createRecord(entityLogicalName, data);
}

export function execute(request: ExecuteRequest) {
  return getXrmWindow().Xrm.WebApi.execute(request);
}

export function retrieveMultipleRecords<TRow extends Row | void = void>(
  entityLogicalName: string,
  options?: string,
  maxPageSize?: number
) {
  return getXrmWindow().Xrm.WebApi.retrieveMultipleRecords(
    entityLogicalName,
    options,
    maxPageSize
  ) as Promise<RetrieveMultipleRecordsResponse<TRow>>;
}

export async function retrieveRecord<TRow extends Row>(
  entityLogicalName: string,
  id: string,
  options?: string
) {
  return getXrmWindow().Xrm.WebApi.retrieveRecord(
    entityLogicalName,
    id,
    options
  ) as Promise<RetrieveMultipleRecordsResponse<TRow>>;
}

export async function fetch(path: string, options?: RequestInit) {
  const clientUrl = getXrmWindow()
    .Xrm.Utility.getGlobalContext()
    .getClientUrl();
  const apiBaseUrl = getApiBaseUrl(clientUrl);
  return nodeFetch(
    `${apiBaseUrl}${path}`,
    mergeHeadersIntoRequestOptions(defaultHeaders, options)
  );
}
