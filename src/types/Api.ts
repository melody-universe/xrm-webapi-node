import { Record } from "./Record";

export interface Api {
  createRecord<TRecord extends Record>(
    entityLogicalName: string,
    data: TRecord
  ): Promise<CreateRecordResult>;
  retrieveMultipleRecords<TRecord extends Record>(
    entityLogicalName: string,
    options?: string,
    maxPageSize?: number
  ): Promise<TRecord[]>;
}

export interface CreateRecordResult {
  entityType: string;
  id: string;
}
