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

export const isPersons = (data: any): data is (string | Person)[] =>
  Array.isArray(data) &&
  (data.length === 0 || typeof data[0] === "string" || "name" in data[0]);

export const isTripRs = (data: any): data is MessageRs<TripRs> =>
  !!data &&
  "data" in data &&
  typeof data.data === "object" &&
  "activities" in data.data;

export const isErrorRs = (data: any): data is ErrorRs =>
  !!data && typeof data === "object" && "exception" in data;
