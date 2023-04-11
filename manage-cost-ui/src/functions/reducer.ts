import {
  ChangeAction,
  ErrorAction,
  PersonChangeAction,
  ReducerState,
} from "../models/action.model";
import {
  ComplexValidateConfig,
  SimpleValidateConfig,
  validateField,
  validateForm,
} from "./validation";

const reducer =
  <T>(
    simpleValidationConfig: SimpleValidateConfig<T>,
    complexValidationConfig: ComplexValidateConfig<T>
  ) =>
  (
    state: ReducerState<T>,
    action: ChangeAction<T> | ErrorAction<T> | PersonChangeAction
  ) => {
    switch (action.type) {
      case "change": {
        let errorState = state.error;
        const formState = { ...state.form, ...action.payload };
        const name = Object.keys(action.payload)[0] as keyof T;
        if (!!errorState[name]) {
          let error: string[] | string | undefined = undefined;
          if (complexValidationConfig[name]) {
            error = validateForm(formState, complexValidationConfig[name]!);
          }
          error =
            validateField(
              action.payload[name]!,
              simpleValidationConfig[name]!
            ) ?? error;
          errorState = { ...errorState, [name]: error };
        }
        return { error: errorState, form: formState };
      }
      case "personChange": {
        return { ...state, form: { ...state.form, persons: action.payload } };
      }
      case "setError": {
        return { ...state, error: action.payload };
      }
    }
  };

export default reducer;
