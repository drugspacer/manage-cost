import ErrorState, { ERRORS } from "../models/error.model";
import { ActivityForm } from "../models/form.model";

type ValidateFunc<T = unknown> = (data: T) => ERRORS | undefined;

export type SimpleValidateConfig<T> = {
  [K in keyof T]?: ValidateFunc<T[K]>[];
};

export type ComplexValidateConfig<T, F> = {
  [K in keyof T]?: ValidateFunc<F>[];
};

export const required: ValidateFunc<{ length: number }> = ({ length }) => {
  if (length === 0) {
    return ERRORS.REQUIRED;
  }
};

export const requiredDate: ValidateFunc<Date | null> = (data) => {
  if (data === null) {
    return ERRORS.REQUIRED;
  }
};

export const listItemRequired: ValidateFunc<ActivityForm> = ({ records }) => {
  if (!records.some(({ isActive }) => isActive)) {
    return ERRORS.IS_ACTIVE_REQUIRED;
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
  return ERRORS.RECORD_BORROW;
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
  return ERRORS.RECORD_LAND;
};

export function validateField<T>(
  data: T,
  functions: ValidateFunc<T>[]
): ERRORS | undefined {
  for (const validate of functions) {
    const res = validate(data);
    if (!!res) {
      return res;
    }
  }
}

function validateForm<T>(
  form: T,
  functions: ValidateFunc<T>[]
): ERRORS[] | undefined {
  const resArr = functions.reduce<ERRORS[]>((resArr, func) => {
    const result = func(form);
    if (result === undefined) {
      return resArr;
    }
    resArr.push(result);
    return resArr;
  }, []);
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
