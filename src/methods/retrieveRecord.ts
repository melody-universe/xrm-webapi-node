import { Fetch } from "../types/methods/Fetch.js";
import { Row } from "../types/Row.js";
import { AnyCoalesce } from "../types/util/AnyCoalesce.js";
import { getCollectionName } from "../util/getCollectionName.js";

export async function retrieveRecord<TRow extends Row | void = void>(
  fetch: Fetch,
  entityLogicalName: string,
  id: string,
  options?: string
) {
  const collectionName = await getCollectionName(entityLogicalName, fetch);
  const response = await fetch(`${collectionName}(${id})${options ?? ""}`, {
    method: "GET",
  });
  if (response.ok) {
    return (await response.json()) as AnyCoalesce<TRow>;
  } else {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}
