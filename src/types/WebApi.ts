import { CreateRecord } from "./methods/CreateRecord.js";
import { Execute } from "./methods/Execute.js";
import { RetrieveMultipleRecords } from "./methods/RetrieveMultipleRecords.js";
import { RetrieveRecord } from "./methods/RetrieveRecord.js";

export interface WebApi {
  createRecord: CreateRecord;
  execute: Execute;
  retrieveMultipleRecords: RetrieveMultipleRecords;
  retrieveRecord: RetrieveRecord;
}
