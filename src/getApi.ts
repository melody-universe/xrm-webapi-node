import Api from "./types/Api";

export default function getApi(): Api {
  if ("Xrm" in window && "WebApi" in (window as XrmWindow).Xrm) {
    return (window as XrmWebApiWindow).Xrm.WebApi;
  } else {
    throw new Error("Could not resolve Dataverse Web Api");
  }
}

type XrmWindow = typeof window & { Xrm: any };
type XrmWebApiWindow = typeof window & { Xrm: { WebApi: Api } };
