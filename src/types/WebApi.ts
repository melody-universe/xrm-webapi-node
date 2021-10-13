import { CreateRecordResult } from "./CreateRecordResult";
import { Row } from "./Row";

export interface WebApi {
  createRecord<TRecord extends Row>(
    entityLogicalName: string,
    data: TRecord
  ): Promise<CreateRecordResult>;
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
