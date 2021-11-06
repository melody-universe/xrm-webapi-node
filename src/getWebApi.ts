import { getFetch } from "./getFetch.js";
import { createRecord } from "./methods/createRecord.js";
import { deleteRecord } from "./methods/deleteRecord.js";
import { retrieveMultipleRecords } from "./methods/retrieveMultipleRecords.js";
import { retrieveRecord } from "./methods/retrieveRecord.js";
import { updateRecord } from "./methods/updateRecord.js";
import { Credentials } from "./types/Credentials.js";
import { CreateRecord } from "./types/methods/CreateRecord.js";
import { DeleteRecord } from "./types/methods/DeleteRecord.js";
import { Execute } from "./types/methods/Execute.js";
import { ExecuteMultiple } from "./types/methods/ExecuteMultiple.js";
import { Fetch } from "./types/methods/Fetch.js";
import { RetrieveMultipleRecords } from "./types/methods/RetrieveMultipleRecords.js";
import { RetrieveRecord } from "./types/methods/RetrieveRecord.js";
import { UpdateRecord } from "./types/methods/UpdateRecord.js";
import { Row } from "./types/Row.js";
import { WebApi } from "./types/WebApi.js";

export function getWebApi(fetch?: Fetch): WebApi;
export function getWebApi(
  url?: string,
  credentials?: Credentials
): WebApi;
export function getWebApi(
  arg0?: Fetch | string,
  credentials?: Credentials
): WebApi {
  const fetch = typeof arg0 === "function" ? arg0 : getFetch(arg0, credentials);
  return {
    async createRecord<TRow extends Row | void = void>(
      ...args: Parameters<CreateRecord<TRow>>
    ): ReturnType<CreateRecord<TRow>> {
      return createRecord(fetch, ...args);
    },
    async deleteRecord(
      ...args: Parameters<DeleteRecord>
    ): ReturnType<DeleteRecord> {
      return deleteRecord(fetch, ...args);
    },
    async execute(...args: Parameters<Execute>): ReturnType<Execute> {
      throw new Error("Not implemented");
    },
    async executeMultiple(
      ...args: Parameters<ExecuteMultiple>
    ): ReturnType<ExecuteMultiple> {
      throw new Error("Not implemented");
    },
    async retrieveMultipleRecords<TRow extends Row | void = void>(
      ...args: Parameters<RetrieveMultipleRecords<TRow>>
    ): ReturnType<RetrieveMultipleRecords<TRow>> {
      return retrieveMultipleRecords(fetch, ...args);
    },
    async retrieveRecord<TRow extends Row | void = void>(
      ...args: Parameters<RetrieveRecord<TRow>>
    ): ReturnType<RetrieveRecord<TRow>> {
      return retrieveRecord(fetch, ...args);
    },
    async updateRecord<TRow extends Row | void = void>(
      ...args: Parameters<UpdateRecord<TRow>>
    ): ReturnType<UpdateRecord<TRow>> {
      return updateRecord(fetch, ...args);
    },
  };
}
