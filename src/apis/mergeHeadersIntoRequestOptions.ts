import { HeadersInit, RequestInit } from "node-fetch";

export function mergeHeadersIntoRequestOptions(
  headers: HeadersInit,
  options?: RequestInit
): RequestInit {
  return {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  };
}
