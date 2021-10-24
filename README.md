# Xrm.WebApi for Node.js

(Mostly\*) unopinionated library for consuming the [Microsoft Dataverse Web API](https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/overview) using the [Xrm.WebApi](https://docs.microsoft.com/en-us/powerapps/developer/model-driven-apps/clientapi/reference/xrm-webapi) interface.

\*: Xrm.WebApi does not provide any documented way for querying metadata definitions. For any functionality not covered by Xrm.WebApi, you can use a [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)-ish function which handles authentication and (`TODO`) [429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) errors.

## Installation

```
npm install xrm-webapi-node
```

## Setup

### getFetch

#### With provided credentials

```js
import { getFetch } from "xrm-webapi-node";

const fetch = getFetch("https://myorg.crm.dynamics.com/", {
  clientId: "12345678-9012-3456-7890-123456789012",
  clientSecret: "abcdefghijklmnopqrstuvwxyz12345678",
  authority:
    "https://login.microsoftonline.com/09876543-2109-8765-4321-098765432109",
});

// OR

const fetch = getFetch("https://myorg.crm.dynamics.com/", {
  clientId: "12345678-9012-3456-7890-123456789012",
  clientSecret: "abcdefghijklmnopqrstuvwxyz12345678",
  tenantId: "09876543-2109-8765-4321-098765432109",
});
```

#### With environment variables

This code snippet assumes the following environment variables are assigned.

- **URL**: https://myorg.crm.dynamics.com/
- **APPLICATION_ID** or **CLIENT_ID**: 12345678-9012-3456-7890-123456789012
- **CLIENT_SECRET**: abcdefghijklmnopqrstuvwxyz12345678
- **AUTHORITY**: https://login.microsoftonline.com/09876543-2109-8765-4321-098765432109<br/>
  OR<br/>
  **TENANT_ID**: 09876543-2109-8765-4321-098765432109

```js
import { getFetch } from "xrm-webapi-node";

const fetch = getFetch();
```

### getApi

#### With fetch

```js
import { getApi, getFetch } from "xrm-webapi-node";

const fetch = getFetch();
const api = getApi(fetch);
```

#### With provided credentials

```js
import { getApi } from "xrm-webapi-node";

const api = getApi("https://myorg.crm.dynamics.com/", {
  clientId: "12345678-9012-3456-7890-123456789012",
  clientSecret: "abcdefghijklmnopqrstuvwxyz12345678",
  authority:
    "https://login.microsoftonline.com/09876543-2109-8765-4321-098765432109",
});

// OR

const api = getApi("https://myorg.crm.dynamics.com/", {
  clientId: "12345678-9012-3456-7890-123456789012",
  clientSecret: "abcdefghijklmnopqrstuvwxyz12345678",
  tenantId: "09876543-2109-8765-4321-098765432109",
});
```

#### With environment variables

This code snippet assumes the same environment variables used to setup `fetch`.

```js
import { getApi } from "xrm-webapi-node";

const api = getApi();
```

## Usage

### Get the display name of a table

```js
(async () => {
  const response = await fetch(
    "EntityDefinitions(LogicalName='contact')?$select=DisplayName"
  );
  const definition = await response.body();
  console.log(`Display Name: ${definition.UserLocalizedLabel.Label}`);
})();
```

### Create a record

```js
(async () => {
  const result = await api.createRecord("contact", {
    firstname: "Melody",
    lastname: "Universe",
  });
  console.log(`Contact ID: ${result.id}`);
})();
```
