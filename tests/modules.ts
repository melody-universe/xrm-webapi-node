import * as BrowserApi from "../src/browser.js";
import * as NodeApi from "../src/index.js";
import * as NodeAuthApi from "../src/auth/index.js";
import { Api } from "../src/types/Api.js";
import { ApiWithAuth } from "../src/types/ApiWithAuth.js";

const browserApi: Api = BrowserApi;
const nodeApi: Api = NodeApi;
const nodeAuthApi: ApiWithAuth = NodeAuthApi;
