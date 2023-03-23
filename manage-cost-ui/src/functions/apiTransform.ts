import Trip, { TripRs } from "../models/trip.model";
import Activity from "../models/activity.model";
import parse from "date-fns/parse";

const tripRsToTrip = (data: TripRs): Trip => {
  const { activities, ...rest } = data;
  return {
    ...rest,
    activities: activities?.map<Activity>(({ date, ...rest }) => ({
      ...rest,
      date: parse(date.substring(0, 10), "y-M-d", new Date()),
    })),
  };
};

export default tripRsToTrip;
