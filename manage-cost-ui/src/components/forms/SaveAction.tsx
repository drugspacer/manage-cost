import React, {
  DOMAttributes,
  FC,
  useState,
  ReactElement,
  useCallback,
  ChangeEventHandler,
  useEffect,
  forwardRef,
} from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Person from "../../models/person.model";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  borrowEqualsSum,
  ComplexValidateConfig,
  landEqualsSum,
  required,
  requiredDate,
  SimpleValidateConfig,
  validateField,
  simpleFormValidation,
  complexFormValidation,
  listItemRequired,
} from "../../functions/validation";
import {
  ActivityForm,
  ActivityFormRq,
  RecordItemForm,
} from "../../models/form.model";
import ErrorState, { ERRORS } from "../../models/error.model";
import { TextFieldProps as MuiTextFieldPropsType } from "@mui/material/TextField/TextField";
import { InputBaseProps } from "@mui/material/InputBase/InputBase";
import { Checkbox } from "@mui/material";
import { CheckboxProps } from "@mui/material/Checkbox/Checkbox";
import Activity from "../../models/activity.model";
import Typography from "@mui/material/Typography";
import StyledTableCell from "../UI/styled/StyledTableCell";
import FormWrapper from "../HOC/FormWrapper";
import TextInput from "../input/TextInput";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const simpleValidationConfig: SimpleValidateConfig<ActivityForm> = {
  name: [required],
  date: [requiredDate],
};

const complexValidationConfig: ComplexValidateConfig<
  RecordItemForm,
  ActivityForm
> = {
  borrowMoney: [borrowEqualsSum],
  landMoney: [landEqualsSum],
  isActive: [listItemRequired],
};

const buildRecordsFormData = (
  persons: Person[],
  activity?: Activity
): RecordItemForm[] =>
  activity
    ? persons.map((person) => {
        const record = activity.records.find(
          (record) => record.person.id === person.id
        );
        return record
          ? {
              person,
              isActive: true,
              landMoney: record.landMoney ? "" + record.landMoney : undefined,
              borrowMoney: record.borrowMoney
                ? "" + record.borrowMoney
                : undefined,
            }
          : {
              person,
              isActive: false,
            };
      })
    : persons.map((person) => ({ person, isActive: true }));

const SaveAction: FC<{
  persons: Person[];
  activity?: Activity;
  onSubmit: (data: ActivityFormRq) => void;
}> = ({ persons, onSubmit, activity }) => {
  const [state, setState] = useState<ActivityForm>({
    sum: activity ? "" + activity.sum : "",
    date: activity?.date ?? new Date(),
    name: activity?.name ?? "",
    id: activity?.id,
    version: activity?.version,
    records: buildRecordsFormData(persons, activity),
  });
  const [errorState, setErrorState] = useState<
    ErrorState<RecordItemForm & ActivityForm>
  >({});
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    const getSum = (
      records: Omit<RecordItemForm, "person">[],
      field: keyof Pick<RecordItemForm, "landMoney" | "borrowMoney">
    ): number =>
      records.reduce((acc, elem) => {
        if (!elem[field] || !elem.isActive || isNaN(parseInt(elem[field]!))) {
          return acc;
        }
        return acc + parseInt(elem[field]!);
      }, 0);

    const sum = Math.max(
      getSum(state.records, "landMoney"),
      getSum(state.records, "borrowMoney")
    ).toString();
    setState((prevState) => ({ ...prevState, sum }));
  }, [state.records]);

  const handleCloseSnackbar = useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setIsOpenSnackbar(false);
    },
    []
  );

  const submitHandler: DOMAttributes<HTMLFormElement>["onSubmit"] = (e) => {
    e.preventDefault();
    const errors = simpleFormValidation(state, simpleValidationConfig);
    const tableErrors = complexFormValidation(state, complexValidationConfig);
    if (!!tableErrors) {
      setIsOpenSnackbar(true);
    }
    if (!!errors || !!tableErrors) {
      setErrorState({ ...errors, ...tableErrors });
      return;
    }

    const activityFormToActivityFormRq = (
      data: ActivityForm
    ): ActivityFormRq => {
      const records = state.records
        .filter(({ isActive }) => isActive)
        .map(({ isActive, ...rest }) => rest);
      return {
        ...data,
        records,
      };
    };

    const data = activityFormToActivityFormRq(state);
    onSubmit(data);
  };

  const onNameChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setState((prevVal) => ({ ...prevVal, name: target.value }));
    if (errorState.name) {
      setErrorState((prevState) => ({
        ...prevState,
        name: validateField(target.value, simpleValidationConfig.name!),
      }));
    }
  };

  const onTableCellChange: (index: number) => InputBaseProps["onChange"] =
    useCallback(
      (index) =>
        ({ target }) => {
          setState((prevValue) => {
            const records = [...prevValue.records];
            records[index] = {
              ...records[index],
              [target.name]:
                "checked" in target && target.name === "isActive"
                  ? target.checked
                  : target.value,
            };
            return { ...prevValue, records };
          });
        },
      []
    );

  const datePickerInput: (props: MuiTextFieldPropsType) => ReactElement = (
    params
  ) => (
    <TextField
      {...params}
      error={!!errorState?.date}
      helperText={errorState?.date}
    />
  );

  const allActiveHandler: CheckboxProps["onChange"] = ({ target }) => {
    setState((prevState) => ({
      ...prevState,
      records: prevState.records.map((item) => ({
        ...item,
        isActive: target.checked,
      })),
    }));
  };

  return (
    <FormWrapper
      onSubmit={submitHandler}
      submitText={activity?.id ? "Изменить" : "Создать"}
    >
      <TextInput<ActivityForm, RecordItemForm & ActivityForm>
        name="name"
        label="Название мероприятия *"
        errorState={errorState}
        state={state}
        onChange={onNameChange}
      />
      <Stack direction="row" spacing={2}>
        <DatePicker
          label="Дата *"
          onChange={(date) => setState((prevState) => ({ ...prevState, date }))}
          renderInput={datePickerInput}
          value={state.date}
        />
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          Итоговая сумма: {state.sum}
        </Typography>
      </Stack>
      <Table
        sx={{ minWidth: 300, paddingLeft: 1, paddingRight: 1 }}
        aria-label="simple table"
        padding="normal"
      >
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Checkbox
                onChange={allActiveHandler}
                checked={state.records.every((item) => item.isActive)}
                sx={{ padding: 0 }}
              />
            </StyledTableCell>
            <StyledTableCell>Имя</StyledTableCell>
            <StyledTableCell>Потратил</StyledTableCell>
            <StyledTableCell>Заплатил</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.records.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell>
                <Checkbox
                  name="isActive"
                  onChange={onTableCellChange(index)}
                  checked={row.isActive}
                  sx={{ padding: 0 }}
                />
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {row.person.name}
              </StyledTableCell>
              <StyledTableCell>
                <OutlinedInput
                  id={`${index}-borrow`}
                  endAdornment={
                    <InputAdornment position="end">Р</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{ inputMode: "numeric", pattern: "\\d*" }}
                  error={row.isActive && !!errorState?.borrowMoney}
                  name="borrowMoney"
                  onChange={onTableCellChange(index)}
                  value={row.borrowMoney}
                />
              </StyledTableCell>
              <StyledTableCell>
                <OutlinedInput
                  id={`${index}-lend`}
                  endAdornment={
                    <InputAdornment position="end">Р</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  name="landMoney"
                  onChange={onTableCellChange(index)}
                  error={row.isActive && !!errorState?.landMoney}
                  inputProps={{ inputMode: "numeric", pattern: "\\d*" }}
                  value={row.landMoney}
                />
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {(errorState?.borrowMoney ||
        errorState?.landMoney ||
        errorState?.isActive) && (
        <Snackbar
          open={isOpenSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {[
              ...((errorState?.borrowMoney as ERRORS[]) ?? []),
              ...((errorState?.landMoney as ERRORS[]) ?? []),
              ...((errorState?.isActive as ERRORS[]) ?? []),
            ].join(", ")}
          </Alert>
        </Snackbar>
      )}
    </FormWrapper>
  );
};

export default SaveAction;
