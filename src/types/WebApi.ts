import { CreateRecord } from "./methods/CreateRecord.js";
import { DeleteRecord } from "./methods/DeleteRecord.js";
import { Execute } from "./methods/Execute.js";
import { ExecuteMultiple } from "./methods/ExecuteMultiple.js";
import { RetrieveMultipleRecords } from "./methods/RetrieveMultipleRecords.js";
import { RetrieveRecord } from "./methods/RetrieveRecord.js";
import { UpdateRecord } from "./methods/UpdateRecord.js";
import { Row } from "./Row.js";

export interface WebApi {
  createRecord<TRow extends Row | void = void>(
    ...args: Parameters<CreateRecord<TRow>>
  ): ReturnType<CreateRecord<TRow>>;
  deleteRecord(...args: Parameters<DeleteRecord>): ReturnType<DeleteRecord>;
  execute: Execute;
  executeMultiple: ExecuteMultiple;
  retrieveMultipleRecords<TRow extends Row | void = void>(
    ...args: Parameters<RetrieveMultipleRecords<TRow>>
  ): ReturnType<RetrieveMultipleRecords<TRow>>;
  retrieveRecord<TRow extends Row | void = void>(
    ...args: Parameters<RetrieveRecord<TRow>>
  ): ReturnType<RetrieveRecord<TRow>>;
  updateRecord<TRow extends Row | void = void>(
    ...args: Parameters<UpdateRecord<TRow>>
  ): ReturnType<UpdateRecord<TRow>>;
}
