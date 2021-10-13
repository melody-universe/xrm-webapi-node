import getNodeApi from "./apis/node/getNodeApi.js";
import { Api } from "./types/Api.js";

let api: Api;

export const createRecord = wrap("createRecord");
export const retrieveMultipleRecords = wrap("retrieveMultipleRecords");
export const retrieveRecord = wrap("retrieveRecord");
export const getApiBaseUrl = wrap("getApiBaseUrl");

function wrap<Key extends keyof Api>(key: Key): Api[Key] {
  return (...args: any) => {
    if (!api) {
      api = getNodeApi();
    }
    const wrappedFunction = api[key] as any;
    return wrappedFunction(...args);
  };
}
