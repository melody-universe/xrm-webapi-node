import getEnvApi from "./apis/getEnvApi.js";

const api = getEnvApi();

export const createRecord = api.createRecord;
export const retrieveMultipleRecords = api.retrieveMultipleRecords;
