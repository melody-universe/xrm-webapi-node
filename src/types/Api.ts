import { WebApi } from "./WebApi.js";
import nodeFetch, { RequestInit } from "node-fetch";
import { AuthenticationParameters } from "./AuthenticationParameters.js";
import { Row } from "./Row.js";
import { CreateRecordResult } from "./CreateRecordResult.js";

export interface Api {
  createRecord<TRecord extends Row>(
    entityLogicalName: string,
    data: TRecord,
    authParams?: AuthenticationParameters
  ): Promise<CreateRecordResult>;
  retrieveMultipleRecords<TRecord extends Row>(
    entityLogicalName: string,
    options?: string,
    maxPageSize?: number,
    authParams?: AuthenticationParameters
  ): Promise<TRecord[]>;
  retrieveRecord<TRecord extends Row>(
    entityLogicalName: string,
    id: string,
    options?: string,
    authParams?: AuthenticationParameters
  ): Promise<TRecord>;
  fetch: (
    url: string,
    options?: RequestInit | undefined,
    authParams?: AuthenticationParameters
  ) => ReturnType<typeof nodeFetch>;
}
