import { Api } from "../types/Api.js";
import { EntityDefinition } from "../types/EntityDefinition.js";

export function createCollectionNameCache(
  retrieveRecord: Api["retrieveRecord"]
) {
  const cache: Cache = { EntityDefinition: "EntityDefinitions" };

  return {
    getCollectionName: async (entityName: string) => {
      if (!(entityName in cache)) {
        const collectionName = await getCollectionName(entityName);
        cache[entityName] = collectionName;
      }
      return cache[entityName];
    },
  };

  async function getCollectionName(entityName: string) {
    const definition = await retrieveRecord<EntityDefinition>(
      "EntityDefinition",
      {
        key: "LogicalName",
        value: entityName,
      },
      "?$select=LogicalCollectionName"
    );
    return definition.LogicalCollectionName;
  }
}

interface Cache {
  [entityName: string]: string;
}
