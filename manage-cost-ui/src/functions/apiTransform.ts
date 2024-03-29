import Trip from "../models/trip.model";
import Person from "../models/person.model";
import Activity from "../models/activity.model";
import ErrorRs, { MessageRs } from "../models/api.model";

type TripRs = Omit<Trip, "activities"> & {
  activities: ActivityRs[];
};

type ActivityRs = Omit<Activity, "date"> & {
  date: string;
};

export const isPersons = (data: any): data is Person[] =>
  Array.isArray(data) && (data.length === 0 || "name" in data[0]);

export const isTripRs = (data: any): data is MessageRs<TripRs> =>
  !!data &&
  "data" in data &&
  typeof data.data === "object" &&
  "activities" in data.data;

export const isErrorRs = (data: any): data is ErrorRs =>
  !!data && typeof data === "object" && "exception" in data;

export function isMessageRs<T>(data: unknown): data is MessageRs<T> {
  return (
    !!data && typeof data === "object" && "message" in data && "data" in data
  );
}
