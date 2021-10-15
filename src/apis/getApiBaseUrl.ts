export function getApiBaseUrl(environmentUrl: string) {
  return `${environmentUrl.replace(/\/$/, "")}/api/data/v9.2`;
}
