import { WebApi } from "./WebApi.js";

export type Api = WebApi & { getApiBaseUrl: () => string };
