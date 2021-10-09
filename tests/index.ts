import { config } from "dotenv";
import { inspect } from "util";
import { createRecord, retrieveMultipleRecords } from "../src/index.js";

config();

(async () => {
  const createResponses = await Promise.all(
    /// TODO: Handle 429 errors
    [...Array(1000)].map((_, index) =>
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
})().catch(console.error);

interface Contact {
  firstname?: string;
  lastname?: string;
}
