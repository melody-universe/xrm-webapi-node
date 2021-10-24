import { Fetch } from "../types/methods/Fetch.js";
import { Row } from "../types/Row.js";
import { AnyCoalesce } from "../types/util/AnyCoalesce.js";
import { getCollectionName } from "../util/getCollectionName.js";

export async function retrieveMultipleRecords<TRow extends Row | void = void>(
  fetch: Fetch,
  entityLogicalName: string,
  options?: string,
  maxPageSize?: number
) {
  const collectionName = await getCollectionName(entityLogicalName, fetch);
  const response = await fetch(`${collectionName}${options ?? ""}`, {
    ...(maxPageSize && {
      headers: { Prefer: `odata.maxpagesize=${maxPageSize}` },
    }),
    method: "GET",
  });
  if (response.ok) {
    const payload = (await response.json()) as any;
    return { entities: payload.value as AnyCoalesce<TRow>[] };
  } else {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}
