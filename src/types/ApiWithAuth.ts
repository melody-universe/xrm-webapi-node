import { Api } from "./Api.js";
import { AuthenticationParameters } from "./AuthenticationParameters.js";
import { PrependParameters } from "./util/PrependParameters.js";

export type ApiWithAuth = {
  [key in keyof Api]: PrependParameters<
    Api[key],
    [authParams: AuthenticationParameters]
  >;
};
