export function getApiBaseUrl(url: string) {
  return `${url.replace(/\/$/, "")}/api/data/v9.2/`;
}
