import nodeFetch, { RequestInit } from "node-fetch";
import { defaultHeaders } from "./util/defaultHeaders.js";
import { getApiBaseUrl } from "./util/getApiBaseUrl.js";
import { getXrmWindow } from "./util/getXrmWindow.js";
import { mergeHeadersIntoRequestOptions } from "./util/mergeHeadersIntoRequestOptions.js";
import { Row } from "./types/Row.js";
import { AuthenticationParameters } from "./types/AuthenticationParameters.js";
import {
  createRecord as authCreateRecord,
  retrieveMultipleRecords as authRetrieveMultipleRecords,
  retrieveRecord as authRetrieveRecord,
  fetch as authFetch,
} from "./util/authApi.js";

export function createRecord<TRecord extends Row>(
  entityLogicalName: string,
  data: TRecord,
  authParams?: AuthenticationParameters
) {
  if (authParams) {
    return authCreateRecord(entityLogicalName, data, authParams);
  } else {
    return getXrmWindow().Xrm.WebApi.createRecord(entityLogicalName, data);
  }
}

export function retrieveMultipleRecords<TRecord extends Row>(
  entityLogicalName: string,
  options?: string,
  maxPageSize?: number,
  authParams?: AuthenticationParameters
) {
  if (authParams) {
    return authRetrieveMultipleRecords<TRecord>(
      entityLogicalName,
      options,
      maxPageSize,
      authParams
    );
  } else {
    return getXrmWindow().Xrm.WebApi.retrieveMultipleRecords<TRecord>(
      entityLogicalName,
      options,
      maxPageSize
    );
  }
}

export async function retrieveRecord<TRecord extends Row>(
  entityLogicalName: string,
  id: string,
  options?: string,
  authParams?: AuthenticationParameters
) {
  if (authParams) {
    return authRetrieveRecord<TRecord>(
      entityLogicalName,
      id,
      options,
      authParams
    );
  } else {
    return getXrmWindow().Xrm.WebApi.retrieveRecord<TRecord>(
      entityLogicalName,
      id,
      options
    );
  }
}

export async function fetch(
  url: string,
  options?: RequestInit,
  authParams?: AuthenticationParameters
) {
  if (authParams) {
    return authFetch(url, options, authParams);
  } else {
    const clientUrl = getXrmWindow()
      .Xrm.Utility.getGlobalContext()
      .getClientUrl();
    const apiBaseUrl = getApiBaseUrl(clientUrl);
    return nodeFetch(
      `${apiBaseUrl}${url}`,
      mergeHeadersIntoRequestOptions(defaultHeaders, options)
    );
  }
}
