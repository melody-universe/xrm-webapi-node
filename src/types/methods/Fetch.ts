import fetch, { RequestInit } from "node-fetch";

export type Fetch = (
  path: string,
  options?: RequestInit
) => ReturnType<typeof fetch>;
