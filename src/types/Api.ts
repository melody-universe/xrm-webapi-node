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
  retrieveRecord<TRecord extends Record>(
    entityLogicalName: string,
    id: string,
    options?: string
  ): Promise<TRecord>;
  retrieveRecord<TRecord extends Record>(
    entityLogicalName: string,
    keyValuePair: KeyValuePair<TRecord>,
    options?: string
  ): Promise<TRecord>;
}

export interface CreateRecordResult {
  entityType: string;
  id: string;
}

export interface KeyValuePair<TRecord extends Record> {
  key: keyof TRecord;
  value: any;
}

export interface RetrieveMultipleRecordsResponse<TRecord extends Record> {
  value: TRecord[];
}
