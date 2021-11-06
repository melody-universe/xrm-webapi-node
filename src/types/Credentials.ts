export type Credentials = BasicCredentials | ClientCredentials;

export type ClientCredentials = {
  clientId: string;
  clientSecret: string;
} & ({ authority: string } | { tenantId: string });

export type BasicCredentials = { username: string; password: string };
