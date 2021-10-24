import { Fetch } from "../types/methods/Fetch.js";
import { Row } from "../types/Row.js";
import { AnyCoalesce } from "../types/util/AnyCoalesce.js";
import { getCollectionName } from "../util/getCollectionName.js";

export async function createRecord<TRow extends Row | void = void>(
  fetch: Fetch,
  entityLogicalName: string,
  data: AnyCoalesce<TRow>
) {
  const collectionName = await getCollectionName(entityLogicalName, fetch);
  const response = await fetch(collectionName, {
    body: JSON.stringify(data),
    method: "POST",
  });
  if (response.ok) {
    const entityIdUrl = response.headers.get("odata-entityid")!;
    const entityIdTest = /\(([0-9a-z\-]*)\)$/.exec(entityIdUrl)!;
    const id = entityIdTest[1]!;
    return { entityType: entityLogicalName, id };
  } else {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}
