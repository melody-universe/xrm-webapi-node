import getBrowserApi from "./apis/getBrowserApi.js";

const api = getBrowserApi();

export const createRecord = api.createRecord;
export const retrieveMultipleRecords = api.retrieveMultipleRecords;
