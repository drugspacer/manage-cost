import Trip, { TripRs } from "../models/trip.model";
import { ActivityFormRq, TripRq } from "../models/form.model";
import axiosApi from "./axios";

export const getTrips = () => axiosApi<Trip[]>({ url: "/trips" });

export const saveTrip = (data: TripRq) =>
  axiosApi<TripRs, TripRq>({ url: "/trips", method: "POST", data });

export const getTrip = (id?: string) =>
  axiosApi<TripRs>({ url: `/trips/${id}` });

export const updateTrip = (data: TripRq) =>
  axiosApi<TripRs, TripRq>({ url: "/trips", method: "PUT", data });

export const deleteTrip = (id: string) =>
  axiosApi({ url: `/trips/${id}`, method: "DELETE" });

export const saveActivity = (data: ActivityFormRq, id?: string) =>
  axiosApi<TripRs, ActivityFormRq>({
    url: `/trips/${id}`,
    method: "POST",
    data,
  });

export const updateActivity = (data: ActivityFormRq, id?: string) =>
  axiosApi<TripRs, ActivityFormRq>({
    url: `/trips/${id}`,
    method: "PUT",
    data,
  });

export const deleteActivity = (tripId: string, activityId: string) =>
  axiosApi<TripRs>({
    url: `/trips/${tripId}/activity/${activityId}`,
    method: "DELETE",
  });

export const finishTrip = (id?: string) =>
  axiosApi<TripRs>({
    url: `/trips/${id}/finish`,
    method: "POST",
  });

export const returnFromArchive = (id?: string) =>
  axiosApi<TripRs>({
    url: `/trips/${id}/return`,
    method: "POST",
  });
