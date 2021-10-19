import { RequestInit, ResponseInit } from "node-fetch";
import { AuthenticationParameters } from "./types/AuthenticationParameters.js";
import { ExecuteRequest } from "./types/ExecuteRequest.js";
import { Row } from "./types/Row.js";
import {
  createRecord as authCreateRecord,
  retrieveMultipleRecords as authRetrieveMultipleRecords,
  retrieveRecord as authRetrieveRecord,
  fetch as authFetch,
} from "./util/authApi.js";
import { getEnvironmentAuthenticationParameters } from "./util/getEnvironmentAuthenticationParameters.js";

export function createRecord<TRecord extends Row>(
  entityLogicalName: string,
  data: TRecord,
  authParams?: AuthenticationParameters
) {
  return authCreateRecord(
    entityLogicalName,
    data,
    authParams ?? getEnvironmentAuthenticationParameters()
  );
}

export function execute(
  _0: ExecuteRequest,
  _1?: AuthenticationParameters
): Promise<ResponseInit> {
  throw new Error(`execute is not yet implemented. Please use fetch instead.`);
}

export function retrieveMultipleRecords<TRecord extends Row>(
  entityLogicalName: string,
  options?: string,
  maxPageSize?: number,
  authParams?: AuthenticationParameters
) {
  return authRetrieveMultipleRecords<TRecord>(
    entityLogicalName,
    options,
    maxPageSize,
    authParams ?? getEnvironmentAuthenticationParameters()
  );
}

export async function retrieveRecord<TRecord extends Row>(
  entityLogicalName: string,
  id: string,
  options?: string,
  authParams?: AuthenticationParameters
) {
  return authRetrieveRecord<TRecord>(
    entityLogicalName,
    id,
    options,
    authParams ?? getEnvironmentAuthenticationParameters()
  );
}

export async function fetch(
  url: string,
  options?: RequestInit,
  authParams?: AuthenticationParameters
) {
  return authFetch(
    url,
    options,
    authParams ?? getEnvironmentAuthenticationParameters()
  );
}
