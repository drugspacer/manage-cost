import Trip, { TripRs } from "../models/trip.model";
import { ActivityFormRq, TripRq } from "../models/form.model";
import { DELETEOptions, POSTOptions, PUTOptions } from "../constants/request";

export const getTrips = async (): Promise<Trip[]> => {
  const response = await fetch("/trips");
  return response.json();
};

export const saveTrip = async (data: TripRq): Promise<TripRs> => {
  POSTOptions.body = JSON.stringify(data);
  const response = await fetch(`/trips`, POSTOptions);
  return response.json();
};

export const getTrip = async (id?: string): Promise<TripRs> => {
  const response = await fetch(`/trips/${id}`);
  return response.json();
};

export const updateTrip = async (data: TripRq): Promise<TripRs> => {
  PUTOptions.body = JSON.stringify(data);
  const response = await fetch(`/trips`, PUTOptions);
  return response.json();
};

export const deleteTrip = async (id: string): Promise<Response> =>
  await fetch(`/trips/${id}`, DELETEOptions);

export const saveActivity = async (
  data: ActivityFormRq,
  id?: string
): Promise<TripRs> => {
  POSTOptions.body = JSON.stringify(data);
  const response = await fetch(`/trips/${id}`, POSTOptions);
  return response.json();
};

export const updateActivity = async (
  data: ActivityFormRq,
  id?: string
): Promise<TripRs> => {
  PUTOptions.body = JSON.stringify(data);
  const response = await fetch(`/trips/${id}`, PUTOptions);
  return response.json();
};

export const deleteActivity = async (
  tripId: string,
  activityId: string
): Promise<TripRs> => {
  const response = await fetch(
    `/trips/${tripId}/activity/${activityId}`,
    DELETEOptions
  );
  return response.json();
};

export const finishTrip = async (id?: string): Promise<TripRs> => {
  const response = await fetch(`/trips/${id}/finish`, POSTOptions);
  return response.json();
};

export const returnFromArchive = async (id?: string): Promise<TripRs> => {
  const response = await fetch(`/trips/${id}/return`, POSTOptions);
  return response.json();
};
