import ErrorState from "./error.model";
import Person from "./person.model";

export type ChangeAction<T> = {
  type: "change";
  payload: Partial<T>;
};

export type ErrorAction<T> = {
  type: "setError";
  payload: ErrorState<T>;
};

export type PersonChangeAction = {
  type: "personChange";
  payload: (Person | string)[];
};

export type ReducerState<T> = {
  form: T;
  error: ErrorState<T>;
};
