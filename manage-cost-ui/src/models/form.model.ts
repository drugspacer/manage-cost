import Trip from "./trip.model";
import Person from "./person.model";
import Activity from "./activity.model";
import RecordItem from "./record.model";
import { User } from "./user.model";

export type TripForm = Pick<Trip, "place" | "name" | "currency"> & {
  persons: Person[];
  id?: string;
  version?: number;
};

type RecordItemFormRq = Pick<RecordItem, "person"> & {
  landMoney?: string;
  borrowMoney?: string;
};

export type RecordItemForm = RecordItemFormRq & {
  isActive: boolean;
};

export type ActivityForm = Pick<Activity, "name" | "tag"> & {
  date: Date | null;
  sum: string;
  records: RecordItemForm[];
  id?: string;
  version?: number;
};

export type ActivityFormRq = Omit<ActivityForm, "records"> & {
  records: RecordItemFormRq[];
};

export type UserRq = Omit<User, "persons"> & {
  persons: Person[];
};

export type PersonAutocomplete = { name: string; inputValue: string };
