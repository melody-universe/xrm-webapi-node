import { EntityDefinition } from "../types/EntityDefinition.js";
import { Fetch } from "../types/methods/Fetch.js";

const cache: Map<Fetch, CollectionNameCache> = new Map();

export async function getCollectionName(entityName: string, fetch: Fetch) {
  let collectionNames = cache.get(fetch);
  if (!collectionNames) {
    collectionNames = {};
    cache.set(fetch, collectionNames);
  }
  if (!(entityName in collectionNames)) {
    const response = await fetch(
      `EntityDefinitions(LogicalName='${entityName}')?` +
        `$select=LogicalCollectionName`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      const definition = (await response.json()) as EntityDefinition;
      return definition.LogicalCollectionName;
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  }

  return collectionNames[entityName];
}

interface CollectionNameCache {
  [entityName: string]: Promise<string>;
}
