import { Row } from "../Row.js";
import { AnyCoalesce } from "../util/AnyCoalesce.js";

export type CreateRecord<TRow extends Row | void = void> = (
  entityLogicalName: string,
  data: AnyCoalesce<TRow>
) => Promise<CreateRecordResult>;

export interface CreateRecordResult {
  entityType: string;
  id: string;
}
