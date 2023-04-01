import Trip, { TripRs } from "../models/trip.model";
import Activity from "../models/activity.model";
import parse from "date-fns/parse";
import { Register } from "../models/login.model";
import { Input } from "../models/form.model";
import Person from "../models/person.model";

export const tripRsToTrip = (data: TripRs): Trip => {
  const { activities, ...rest } = data;
  return {
    ...rest,
    activities: activities?.map<Activity>(({ date, ...rest }) => {
      let parsedDate: Date;
      if (typeof date === "number") {
        parsedDate = new Date(date);
      } else {
        parsedDate = parse(date.substring(0, 10), "y-M-d", new Date());
      }
      return {
        ...rest,
        date: parsedDate,
      };
    }),
  };
};

export const registerToUserRq = ({ username, password, persons }: Register) => {
  return {
    username,
    password,
    persons: personsToDataRq(persons),
  };
};

export const personsToDataRq = (persons: (string | Person)[]) =>
  persons.map<Input<Person>>((item) =>
    typeof item === "string" ? { name: item } : item
  );
