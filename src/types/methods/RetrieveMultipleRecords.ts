import { Row } from "../Row.js";
import { AnyCoalesce } from "../util/AnyCoalesce.js";

export type RetrieveMultipleRecords<TRow extends Row | void = void> = (
  entityLogicalName: string,
  options?: string,
  maxPageSize?: number
) => Promise<RetrieveMultipleRecordsResponse<TRow>>;

export interface RetrieveMultipleRecordsResponse<
  TRow extends Row | void = void
> {
  entities: AnyCoalesce<TRow>[];
}
