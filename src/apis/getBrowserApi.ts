import { Api } from "../types/Api.js";

export default function getBrowserApi(): Api {
  if (hasXrmWebApi(window)) {
    return wrapWindowApi(window);
  } else if (hasXrmWebApi(window.parent)) {
    return wrapWindowApi(window.parent);
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

function wrapWindowApi(container: XrmWebApiWindow): Api {
  return {
    createRecord: container.Xrm.WebApi.createRecord.bind(container.Xrm.WebApi),
    retrieveMultipleRecords: container.Xrm.WebApi.retrieveMultipleRecords.bind(container.Xrm.WebApi),
    retrieveRecord: container.Xrm.WebApi.retrieveRecord.bind(container.Xrm.WebApi),
  };
}
