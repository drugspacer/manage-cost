import RecordItem from "./record.model";
import { Id, Version } from "./model";

interface Activity extends Id, Version {
  name: string;
  date: Date;
  sum: number;
  records: RecordItem[];
}

export type ActivityRs = Omit<Activity, "date"> & {
  date: string;
};

export default Activity;
