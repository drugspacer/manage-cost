import Trip from "../../models/trip.model";
import { ActivityFormRq, TripForm } from "../../models/form.model";
import ApiService from "../api.service";

class TripApi {
  static getTrips() {
    return ApiService.request<Trip[]>({
      url: "/trips",
    });
  }

  static saveTrip(data: TripForm) {
    return ApiService.request<Trip, TripForm>({
      url: "/trips",
      method: "POST",
      data,
    });
  }

  static getTrip(id?: string) {
    return ApiService.request<Trip>({ url: `/trips/${id}` });
  }

  static updateTrip(data: TripForm) {
    return ApiService.request<Trip, TripForm>({
      url: "/trips",
      method: "PUT",
      data,
    });
  }

  static deleteTrip(id: string) {
    return ApiService.request({ url: `/trips/${id}`, method: "DELETE" });
  }

  static saveActivity(data: ActivityFormRq, id?: string) {
    return ApiService.request<Trip, ActivityFormRq>({
      url: `/trips/${id}`,
      method: "POST",
      data,
    });
  }

  static updateActivity(data: ActivityFormRq, id?: string) {
    return ApiService.request<Trip, ActivityFormRq>({
      url: `/trips/${id}`,
      method: "PUT",
      data,
    });
  }

  static deleteActivity(tripId: string, activityId: string) {
    return ApiService.request<Trip>({
      url: `/trips/${tripId}/activity/${activityId}`,
      method: "DELETE",
    });
  }

  static finishTrip(id?: string) {
    return ApiService.request<Trip>({
      url: `/trips/${id}/finish`,
      method: "POST",
    });
  }

  static returnFromArchive(id?: string) {
    return ApiService.request<Trip>({
      url: `/trips/${id}/return`,
      method: "POST",
    });
  }
}

export default TripApi;
