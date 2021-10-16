import { WebApi } from "../types/WebApi.js";

let xrmWindow: XrmWebApiWindow;

export function getXrmWindow(): XrmWebApiWindow {
  if (!xrmWindow) {
    if (hasXrmWebApi(window)) {
      xrmWindow = window;
    } else if (hasXrmWebApi(window.parent)) {
      xrmWindow = window.parent;
    } else {
      throw new Error("Unable to resolve Dataverse API");
    }
  }
  return xrmWindow;
}

function hasXrmWebApi(window: Window): window is XrmWebApiWindow {
  return hasXrm(window) && "WebApi" in window.Xrm;
}

function hasXrm(window: Window): window is XrmWindow {
  return "Xrm" in window;
}

type XrmWindow = Window & { Xrm: any };
type XrmWebApiWindow = Window & {
  Xrm: {
    Utility: { getGlobalContext: () => { getClientUrl: () => string } };
    WebApi: WebApi;
  };
};
