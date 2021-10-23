import { RequestInit, Response } from "node-fetch";
import { ExecuteRequest } from "./types/methods/Execute.js";
import { Row } from "./types/Row.js";
import {
  createRecord as authCreateRecord,
  retrieveMultipleRecords as authRetrieveMultipleRecords,
  retrieveRecord as authRetrieveRecord,
  fetch as authFetch,
} from "./auth/index.js";
import { getEnvironmentAuthenticationParameters } from "./util/getEnvironmentAuthenticationParameters.js";
import { AnyCoalesce } from "./types/util/AnyCoalesce.js";

export function createRecord<TRow extends Row | void = void>(
  entityLogicalName: string,
  data: AnyCoalesce<TRow>
) {
  return authCreateRecord(
    getEnvironmentAuthenticationParameters(),
    entityLogicalName,
    data
  );
}

export function execute(request: ExecuteRequest): Promise<Response> {
  throw new Error(`execute is not yet implemented. Please use fetch instead.`);
}

export function retrieveMultipleRecords<TRow extends Row | void = void>(
  entityLogicalName: string,
  options?: string,
  maxPageSize?: number
) {
  return authRetrieveMultipleRecords<TRow>(
    getEnvironmentAuthenticationParameters(),
    entityLogicalName,
    options,
    maxPageSize
  );
}

export async function retrieveRecord<TRow extends Row>(
  entityLogicalName: string,
  id: string,
  options?: string
) {
  return authRetrieveRecord<TRow>(
    getEnvironmentAuthenticationParameters(),
    entityLogicalName,
    id,
    options
  );
}

export async function fetch(path: string, options?: RequestInit) {
  return authFetch(getEnvironmentAuthenticationParameters(), path, options);
}
