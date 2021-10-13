import { Row } from "./Row";


export interface RetrieveMultipleRecordsResponse<TRecord extends Row> {
  value: TRecord[];
}
