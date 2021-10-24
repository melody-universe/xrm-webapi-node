import { Fetch } from "../types/methods/Fetch.js";
import { getCollectionName } from "../util/getCollectionName.js";

export async function deleteRecord(
  fetch: Fetch,
  entityLogicalName: string,
  id: string
) {
  const collectionName = await getCollectionName(entityLogicalName, fetch);
  const response = await fetch(`${collectionName}(${id})`, {
    method: "DELETE",
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
