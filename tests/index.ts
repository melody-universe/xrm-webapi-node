import { config } from "dotenv";
import { inspect } from "util";
import { getFetch, getWebApi } from "../src/index.js";

config();

(async () => {
  const fetch = getFetch();
  const api = getWebApi(fetch);

  const response = await fetch(
    "EntityDefinitions(LogicalName='contact')?$select=DisplayName"
  );
  const contactEntity = await response.json();
  log(contactEntity);

  const createResponses = await Promise.all(
    /// TODO: Handle 429 errors
    [...Array(10)].map((_, index) =>
      api.createRecord<Contact>("contact", {
        firstname: `Melody ${index}`,
        lastname: "Universe",
      })
    )
  );
  log(createResponses);

  const contacts = await api.retrieveMultipleRecords<Contact>(
    "contact",
    "?$select=fullname&$filter=fullname ne null"
  );
  log(contacts);

  const contact = await api.retrieveRecord<Contact>(
    "contact",
    contacts.entities[0]!.contactid!,
    "?$select=fullname"
  );
  log(contact);

  const updateResponse = await api.updateRecord("contact", contact.contactid!, {
    firstname: "Melody",
  });
  log(updateResponse);

  const updatedContact = await api.retrieveRecord<Contact>(
    "contact",
    contact.contactid!,
    "?$select=fullname"
  );
  log(updatedContact);

  const deleteResponses = await Promise.all(
    contacts.entities.map((contact) =>
      api.deleteRecord("contact", contact.contactid!)
    )
  );
  log(deleteResponses);
})().catch(console.error);

interface Contact {
  contactid?: string;
  firstname?: string;
  lastname?: string;
}

function log(object: any) {
  console.log(inspect(object, { colors: true, depth: null }));
}
