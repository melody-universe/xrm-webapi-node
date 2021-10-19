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
import { ExecuteRequest } from "./types/ExecuteRequest.js";

export function createRecord<TRecord extends Row>(
  entityLogicalName: string,
  data: TRecord,
  authParams?: AuthenticationParameters
) {
  if (authParams) {
    throw new Error(
      "External authentication is currently not supported in the browser."
    );
    // return authCreateRecord(entityLogicalName, data, authParams);
  } else {
    return getXrmWindow().Xrm.WebApi.createRecord(entityLogicalName, data);
  }
}

export function execute(
  request: ExecuteRequest,
  authParams?: AuthenticationParameters
) {
  if (authParams) {
    throw new Error(
      `execute AuthenticationParameters is not yet implemented. Please use fetch instead.`
    );
  } else {
    return getXrmWindow().Xrm.WebApi.execute(request);
  }
}

export function retrieveMultipleRecords<TRecord extends Row>(
  entityLogicalName: string,
  options?: string,
  maxPageSize?: number,
  authParams?: AuthenticationParameters
) {
  if (authParams) {
    throw new Error(
      "External authentication is currently not supported in the browser."
    );
    /* return authRetrieveMultipleRecords<TRecord>(
      entityLogicalName,
      options,
      maxPageSize,
      authParams
    ); */
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
    throw new Error(
      "External authentication is currently not supported in the browser."
    );
    /* return authRetrieveRecord<TRecord>(
      entityLogicalName,
      id,
      options,
      authParams
    ); */
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
    throw new Error(
      "External authentication is currently not supported in the browser."
    );
    // return authFetch(url, options, authParams);
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
