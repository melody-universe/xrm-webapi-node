export type ClientCredentials = {
  clientId: string;
  clientSecret: string;
} & ({ authority: string } | { tenantId: string });
