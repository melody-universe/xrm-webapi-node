import getEnvApi from "./apis/getEnvApi.js";
import { Api } from "./types/Api.js";

let api: Api;

export const createRecord = wrap("createRecord");
export const retrieveMultipleRecords = wrap("retrieveMultipleRecords");
export const retrieveRecord = wrap("retrieveRecord");

function wrap<Key extends keyof Api>(key: Key): Api[Key] {
  return ((...args: Parameters<Api[Key]>) => {
    if (!api) {
      api = getEnvApi();
    }
    const wrappedFunction = api[key] as (
      ...args: Parameters<Api[Key]>
    ) => ReturnType<Api[Key]>;
    return wrappedFunction(...args);
  }) as unknown as Api[Key];
}
