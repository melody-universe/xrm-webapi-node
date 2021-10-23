import { WebApi } from "./WebApi.js";
import { Fetch } from "./methods/Fetch.js";

export interface Api extends WebApi {
  fetch: Fetch;
}
