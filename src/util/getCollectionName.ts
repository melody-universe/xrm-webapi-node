import { Api } from "../types/Api.js";
import { AuthenticationParameters } from "../types/AuthenticationParameters.js";
import { EntityDefinition } from "../types/EntityDefinition.js";

const cache: CollectionNameCache = {};

export async function getCollectionName(
  entityName: string,
  fetch: Api["fetch"],
  authParams?: AuthenticationParameters
) {
  const url = authParams?.environmentUrl ?? "/";

  if (!(url in cache)) {
    cache[url] = {};
  }
  if (!(entityName in cache[url])) {
    const response = await fetch(
      `EntityDefinitions(LogicalName='${entityName}')?` +
        `$select=LogicalCollectionName`,
      {
        method: "GET",
      },
      authParams
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
