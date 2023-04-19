import Trip from "./trip.model";
import Person from "./person.model";
import Activity from "./activity.model";
import RecordItem from "./record.model";
import { User } from "./user.model";

export type Input<T extends { id: string }> = {
  [K in keyof Omit<T, "id">]: T[K];
} & { id?: T["id"] };

export type TripForm = Pick<Trip, "place" | "name"> & {
  persons: (string | Person)[];
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

export type ActivityForm = Pick<Activity, "name"> & {
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
  persons: (string | Person)[];
};

export type PersonAutocomplete = Pick<Person, "name"> & { title: string };
