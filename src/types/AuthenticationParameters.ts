export interface AuthenticationParameters {
  environmentUrl: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    authority: string;
    tenantId: string;
  };
}
