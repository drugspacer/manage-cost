import { TripRs } from "../models/trip.model";
import ErrorRs from "../models/api.model";
import { User } from "../models/user.model";

type AssertIsTripRs = (trip?: TripRs) => asserts trip is TripRs;

export const isTripRs: AssertIsTripRs = (trip) => {
  if (trip === undefined) {
    throw new Error("trip is undefined");
  }
};

type AssertIsErrorRs = (error: unknown) => asserts error is ErrorRs;

export const isErrorRs: AssertIsErrorRs = (error) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "timestamp" in error &&
    "path" in error &&
    "exception" in error
  ) {
    return;
  }
  throw new Error("this is not error");
};

type AssertIsString = (value?: string) => asserts value is string;

export const isString: AssertIsString = (value) => {
  if (typeof value !== "string") {
    throw new Error("token not a string");
  }
};

type AssertIsUser = (user?: User) => asserts user is User;

export const isUser: AssertIsUser = (user) => {
  if (user === undefined) {
    throw new Error("user is undefined");
  }
};
