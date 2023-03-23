import Trip from "./trip.model";
import Person from "./person.model";
import Activity from "./activity.model";
import RecordItem from "./record.model";

export type Input<T extends { id: string }> = {
  [K in keyof Omit<T, "id">]: T[K];
} & { id?: T["id"] };

export type TripForm = Pick<Trip, "place" | "name"> & {
  persons: (string | Person)[];
  id?: string;
  version?: number;
};

export type TripRq = Pick<Trip, "place" | "name"> & {
  id?: string;
  version?: number;
  persons: Input<Person>[];
};

export type RecordItemFormRq = Pick<RecordItem, "person"> & {
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
