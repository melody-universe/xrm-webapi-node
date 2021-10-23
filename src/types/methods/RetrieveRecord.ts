import { Row } from "../Row.js";
import { AnyCoalesce } from "../util/AnyCoalesce.js";

export type RetrieveRecord<TRow extends Row | void = void> = (
  entityLogicalName: string,
  id: string,
  options?: string
) => Promise<AnyCoalesce<TRow>>;
