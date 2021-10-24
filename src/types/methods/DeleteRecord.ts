export type DeleteRecord = (
  entityLogicalName: string,
  id: string
) => Promise<DeleteRecordResult>;

export interface DeleteRecordResult {
  entityType: string;
  id: string;
}
