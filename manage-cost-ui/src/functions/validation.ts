import ErrorState from "../models/error.model";
import { ActivityForm } from "../models/form.model";
import Person from "../models/person.model";
import error from "../../public/locales/ru/common.json";

export type ValidateFunc<T = unknown> = (
  data: T
) => keyof typeof error.validationError | undefined;

export type SimpleValidateConfig<T> = {
  [K in keyof T]?: ValidateFunc<T[K]>[];
};

export type ComplexValidateConfig<T, F = T> = {
  [K in keyof T]?: ValidateFunc<F>[];
};

export const required: ValidateFunc<{ length: number }> = ({ length }) => {
  if (length === 0) {
    return "REQUIRED";
  }
};

export const requiredPersonNonBlank: ValidateFunc<(Person | string)[]> = (
  array
) => {
  if (
    !array.every((item) => (typeof item === "string" ? !!item : !!item.name))
  ) {
    return "REQUIRED_MANY";
  }
};

export const minLength: (
  minLength: number
) => ValidateFunc<{ length: number }> =
  (minLength) =>
  ({ length }) => {
    if (length < minLength) {
      return "MIN_LENGTH";
    }
  };

export const requiredDate: ValidateFunc<Date | null> = (data) => {
  if (data === null) {
    return "REQUIRED";
  }
};

export const requiredSum: ValidateFunc<string> = (value) => {
  if (value.length === 0 || +value <= 0) {
    return "REQUIRED_SUM";
  }
};

export const confirmPassword: ValidateFunc<{
  password: string;
  confirmPassword: string;
}> = ({ password, confirmPassword }) => {
  if (confirmPassword !== password) {
    return "CONFIRM_PASSWORD";
  }
};

export const listItemRequired: ValidateFunc<ActivityForm> = ({ records }) => {
  if (!records.some(({ isActive }) => isActive)) {
    return "IS_ACTIVE_REQUIRED";
  }
};

export const borrowEqualsSum: ValidateFunc<ActivityForm> = ({
  sum,
  records,
}) => {
  records = records.filter(({ isActive }) => isActive);
  if (
    records.every(
      ({ borrowMoney }) => borrowMoney === undefined || +borrowMoney === 0
    ) ||
    +sum ===
      records.reduce((sum, { borrowMoney }) => {
        if (borrowMoney === undefined) {
          return sum;
        }
        return sum + (+borrowMoney || 0);
      }, 0)
  ) {
    return;
  }
  return "RECORD_BORROW";
};

export const landEqualsSum: ValidateFunc<ActivityForm> = ({ sum, records }) => {
  if (
    +sum ===
    records
      .filter(({ isActive }) => isActive)
      .reduce((sum, { landMoney }) => {
        if (landMoney === undefined) {
          return sum;
        }
        return sum + (+landMoney || 0);
      }, 0)
  ) {
    return;
  }
  return "RECORD_LAND";
};

export function validateField<T>(
  data: T,
  functions: ValidateFunc<T>[]
): ReturnType<ValidateFunc<T>> | undefined {
  for (const validate of functions) {
    const res = validate(data);
    if (!!res) {
      return res;
    }
  }
}

export function validateForm<T>(
  form: T,
  functions: ValidateFunc<T>[]
): (keyof typeof error.validationError)[] | undefined {
  const resArr = functions.reduce<(keyof typeof error.validationError)[]>(
    (resArr, func) => {
      const result = func(form);
      if (result === undefined) {
        return resArr;
      }
      resArr.push(result);
      return resArr;
    },
    []
  );
  if (resArr.length === 0) {
    return;
  }
  return resArr;
}

export function simpleFormValidation<T extends Object>(
  data: T,
  config: SimpleValidateConfig<T>
): ErrorState<T> | undefined {
  let validationResult: ErrorState<T> = {};
  Object.entries(config).forEach(([key, validationArr]) => {
    const res = validateField(data[key as keyof T], validationArr);
    if (res === undefined) {
      return;
    }
    validationResult[key as keyof T] = res;
  });
  return Object.keys(validationResult).length > 0
    ? validationResult
    : undefined;
}

export function complexFormValidation<T extends Object, F extends Object>(
  form: F,
  config: ComplexValidateConfig<T, F>
): ErrorState<T> | undefined {
  let validationResult: ErrorState<T> = {};
  Object.entries(config).forEach(([key, validationArr]) => {
    const res = validateForm(form, validationArr);
    if (res === undefined) {
      return;
    }
    validationResult[key as keyof T] = res;
  });
  return Object.keys(validationResult).length > 0
    ? validationResult
    : undefined;
}

export const getFirstError = (
  errors:
    | keyof typeof error.validationError
    | (keyof typeof error.validationError)[]
    | undefined
): keyof typeof error.validationError | undefined => {
  if (Array.isArray(errors)) {
    return errors[0];
  }
  return errors;
};
