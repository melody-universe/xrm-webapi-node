import { ResponseInit } from "node-fetch";
import { CreateRecordResult } from "./CreateRecordResult.js";
import { ExecuteRequest } from "./ExecuteRequest.js";
import { Row } from "./Row.js";

export interface WebApi {
  createRecord<TRecord extends Row>(
    entityLogicalName: string,
    data: TRecord
  ): Promise<CreateRecordResult>;
  execute(request: ExecuteRequest): Promise<ResponseInit>;
  retrieveMultipleRecords<TRecord extends Row>(
    entityLogicalName: string,
    options?: string,
    maxPageSize?: number
  ): Promise<TRecord[]>;
  retrieveRecord<TRecord extends Row>(
    entityLogicalName: string,
    id: string,
    options?: string
  ): Promise<TRecord>;
}
