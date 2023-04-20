import RecordItem from "./record.model";
import { Id, Version } from "./model";
import Dictionary from "./dictionary.model";

interface Activity extends Id, Version {
  name: string;
  date: Date;
  sum: number;
  records: RecordItem[];
  tag?: Dictionary;
}

export default Activity;
