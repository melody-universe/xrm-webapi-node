import { Fetch } from "../types/methods/Fetch.js";
import { Row } from "../types/Row.js";
import { AnyCoalesce } from "../types/util/AnyCoalesce.js";
import { getCollectionName } from "../util/getCollectionName.js";

export async function updateRecord<TRow extends Row | void = void>(
  fetch: Fetch,
  entityLogicalName: string,
  id: string,
  data: AnyCoalesce<TRow>
) {
  const collectionName = await getCollectionName(entityLogicalName, fetch);
  const response = await fetch(`${collectionName}(${id})`, {
    body: JSON.stringify(data),
    method: "PATCH",
  });
  if (response.ok) {
    return {
      entityType: entityLogicalName,
      id,
    };
  } else {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}
