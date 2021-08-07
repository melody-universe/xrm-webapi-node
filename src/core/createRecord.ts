import getApi from "../getApi";
import Record from "../types/Record";

export default function createRecord(
  entityLogicalName: string,
  data: Record
): Promise<CreateRecordResult> {
  const api = getApi();
  return api.createRecord(entityLogicalName, data);
}

export interface CreateRecordResult {
  entityType: string;
  id: string;
}
