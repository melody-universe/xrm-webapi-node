import fetch, { HeadersInit } from "node-fetch";
import { EntityDefinition } from "../types/EntityDefinition.js";

export function createCollectionNameLookup(
  apiBaseUrl: string,
  headersPromise: Promise<HeadersInit>
) {
  const cache: Cache = {};

  return {
    getCollectionName: (entityName: string) => {
      if (!(entityName in cache)) {
        const collectionName = getCollectionName(entityName);
        cache[entityName] = collectionName;
      }
      return cache[entityName];
    },
  };

  async function getCollectionName(entityName: string) {
    const response = await fetch(
      `${apiBaseUrl}/EntityDefinitions(LogicalName='${entityName}')?` +
        `$select=LogicalCollectionName`,
      {
        headers: await headersPromise,
        method: "GET",
      }
    );
    if (response.ok) {
      const definition = (await response.json()) as EntityDefinition;
      console.log(definition);
      return definition.LogicalCollectionName;
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  }
}

interface Cache {
  [entityName: string]: Promise<string>;
}
