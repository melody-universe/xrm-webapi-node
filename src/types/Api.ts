import type createRecord from "../core/createRecord";

export default interface Api {
  createRecord: typeof createRecord;
}
