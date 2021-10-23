import { EntityDefinition } from "../types/EntityDefinition.js";
import { Fetch } from "../types/methods/Fetch.js";

const cache: CollectionNameCache = {};

export async function getCollectionName(
  entityName: string,
  fetch: Fetch,
  environmentUrl?: string
) {
  const url = environmentUrl ?? "/";

  if (!(url in cache)) {
    cache[url] = {};
  }
  if (!(entityName in cache[url])) {
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

  return cache[url][entityName];
}

interface CollectionNameCache {
  [url: string]: {
    [entityName: string]: Promise<string>;
  };
}
