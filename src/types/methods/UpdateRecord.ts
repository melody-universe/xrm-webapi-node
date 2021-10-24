import { Row } from "../Row.js";
import { AnyCoalesce } from "../util/AnyCoalesce.js";

export type UpdateRecord<TRow extends Row | void = void> = (
  entityLogicalName: string,
  id: string,
  data: AnyCoalesce<TRow>
) => Promise<UpdateRecordResult>;

export interface UpdateRecordResult {
  entityType: string;
  id: string;
}
