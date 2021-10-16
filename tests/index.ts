import { config } from "dotenv";
import { inspect } from "util";
import {
  createRecord,
  retrieveMultipleRecords,
  retrieveRecord,
} from "../src/index.js";

config();

(async () => {
  const createResponses = await Promise.all(
    /// TODO: Handle 429 errors
    [...Array(10)].map((_, index) =>
      createRecord<Contact>("contact", {
        firstname: `Melody ${index}`,
        lastname: "Universe",
      })
    )
  );
  console.log(inspect(createResponses, { colors: true, depth: null }));
  const contacts = await retrieveMultipleRecords(
    "contact",
    "?$select=fullname"
  );
  console.log(inspect(contacts, { colors: true, depth: null }));
  const contact = await retrieveRecord(
    "contact",
    contacts[0]!.contactid,
    "?$select=fullname"
  );
  console.log(inspect(contact, { colors: true, depth: null }));
})().catch(console.error);

interface Contact {
  firstname?: string;
  lastname?: string;
}
