import { ExecuteRequest } from "./Execute";

export type ExecuteMultiple = (
  requests: ExecuteRequest[]
) => Promise<Response[]>;
