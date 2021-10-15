import { WebApi } from "./WebApi.js";
import nodeFetch, { RequestInit } from "node-fetch";

export type Api = WebApi & {
  fetch: (
    url: string,
    options?: RequestInit | undefined
  ) => ReturnType<typeof nodeFetch>;
};
