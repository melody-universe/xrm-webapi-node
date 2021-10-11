import { Api } from "../types/Api.js";

export default function getBrowserApi(): Api {
  if (hasXrmWebApi(window)) {
    return window.Xrm.WebApi;
  } else if (hasXrmWebApi(window.parent)) {
    return window.parent.Xrm.WebApi;
  } else {
    throw new Error("Unable to resolve Dataverse API");
  }
}

function hasXrmWebApi(window: Window): window is XrmWebApiWindow {
  return hasXrm(window) && "WebApi" in window.Xrm;
}

function hasXrm(window: Window): window is XrmWindow {
  return "Xrm" in window;
}

type XrmWindow = Window & { Xrm: any };
type XrmWebApiWindow = Window & { Xrm: { WebApi: Api } };
