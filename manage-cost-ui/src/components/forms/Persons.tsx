import React, {
  DOMAttributes,
  ChangeEventHandler,
  useContext,
  useCallback,
  MouseEventHandler,
  useReducer,
} from "react";
import TextField from "@mui/material/TextField";
import Person from "../../models/person.model";
import {
  validateField,
  requiredPersonNonBlank,
} from "../../functions/validation";
import FormWrapper from "../HOC/FormWrapper";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/Auth";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { useSnackbar } from "notistack";
import { ChangeAction } from "../../models/action.model";

type ErrorAction = {
  type: "setError";
  payload: string | string[];
};

type DeleteAction = {
  type: "delete";
  payload: number;
};

type AddAction = {
  type: "add";
};

const reducer = (
  state: { form: (string | Person)[]; error?: string | string[] },
  action:
    | ChangeAction<Record<string, string>>
    | ErrorAction
    | DeleteAction
    | AddAction
) => {
  switch (action.type) {
    case "change": {
      const index = Object.keys(action.payload)[0];
      const person = state.form[+index];
      state.form[+index] =
        typeof person === "string"
          ? action.payload[index]!
          : { ...person, name: action.payload[index]! };
      state.form = [...state.form];
      if (!!state.error) {
        state.error = validateField(state.form, [requiredPersonNonBlank]);
      }
      return { ...state };
    }
    case "setError": {
      return { ...state, error: action.payload };
    }
    case "delete": {
      return {
        ...state,
        form: state.form.filter((item, indexEl) => action.payload !== indexEl),
      };
    }
    case "add": {
      return { ...state, form: [...state.form, ""] };
    }
  }
};

const Persons = ({
  onSubmit,
}: {
  onSubmit: (persons: (string | Person)[]) => void;
}) => {
  const { user } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, {
    form: user!.persons,
    error: undefined,
  });
  const { t: common } = useTranslation();
  const { t: profile } = useTranslation("profile");
  const { enqueueSnackbar } = useSnackbar();

  const submitHandler: DOMAttributes<HTMLFormElement>["onSubmit"] = async (
    e
  ) => {
    e.preventDefault();
    const errors = validateField(state.form, [requiredPersonNonBlank]);
    if (!!errors) {
      dispatch({ type: "setError", payload: errors });
      enqueueSnackbar(errors, { variant: "error" });
      return;
    }
    await onSubmit(state.form);
  };

  const changeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) =>
      dispatch({ type: "change", payload: { [target.name]: target.value } }),
    []
  );

  const handleDelete = useCallback(
    (index: number): MouseEventHandler<HTMLButtonElement> =>
      () =>
        dispatch({ type: "delete", payload: index }),
    []
  );

  const addHandler = () => dispatch({ type: "add" });

  return (
    <FormWrapper onSubmit={submitHandler} submitText={common("button.save")}>
      {state.form.map((person, index) => (
        <TextField
          id={`person.${index}`}
          variant="outlined"
          name={"" + index}
          error={!!state.error}
          value={typeof person === "string" ? person : person.name}
          margin="normal"
          onChange={changeHandler}
          key={typeof person === "string" ? index : person.id}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={profile("ariaLabel.deletePerson")}
                  onClick={handleDelete(index)}
                  edge="end"
                >
                  <ClearOutlinedIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          placeholder={profile("person")}
        />
      ))}
      <Button onClick={addHandler}>{common("input.addMore")}</Button>
    </FormWrapper>
  );
};

Persons.muiName = FormWrapper.muiName;

export default Persons;
