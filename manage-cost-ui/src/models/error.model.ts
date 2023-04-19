import errors from "../../public/locales/ru/common.json";

type ErrorState<T> = {
  [K in keyof T]?:
    | keyof typeof errors.validationError
    | (keyof typeof errors.validationError)[];
};

export default ErrorState;
