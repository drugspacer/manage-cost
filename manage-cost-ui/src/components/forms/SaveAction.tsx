import React, {
  DOMAttributes,
  useState,
  ReactElement,
  useCallback,
  ChangeEventHandler,
  useEffect,
} from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
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
  requiredSum,
} from "../../functions/validation";
import {
  ActivityForm,
  ActivityFormRq,
  RecordItemForm,
} from "../../models/form.model";
import ErrorState from "../../models/error.model";
import { TextFieldProps as MuiTextFieldPropsType } from "@mui/material/TextField/TextField";
import { InputBaseProps } from "@mui/material/InputBase/InputBase";
import { Checkbox, Tooltip } from "@mui/material";
import Activity from "../../models/activity.model";
import Typography from "@mui/material/Typography";
import StyledTableCell from "../UI/styled/StyledTableCell";
import FormWrapper from "../HOC/FormWrapper";
import TextInput from "../input/TextInput";
import theme from "../../themes/theme";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import i18n from "../../i18n";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ru from "date-fns/locale/ru";
import en from "date-fns/locale/en-US";
import localizedErrors from "../../../public/locales/ru/common.json";
import { TFuncKey } from "i18next";
import { isErrorRs } from "../../functions/apiTransform";

type SaveActionProps = {
  persons: Person[];
  activity?: Activity;
  onSubmit: (data: ActivityFormRq) => void;
};

const simpleValidationConfig: SimpleValidateConfig<ActivityForm> = {
  name: [required],
  date: [requiredDate],
  sum: [requiredSum],
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

const SaveAction = ({ persons, onSubmit, activity }: SaveActionProps) => {
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
  const { enqueueSnackbar } = useSnackbar();
  const { t: common } = useTranslation();
  const { t: trip } = useTranslation("trip");

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

  const submitHandler: DOMAttributes<HTMLFormElement>["onSubmit"] = async (
    e
  ) => {
    e.preventDefault();
    const errors = simpleFormValidation(state, simpleValidationConfig);
    const tableErrors = complexFormValidation(state, complexValidationConfig);
    if (!!tableErrors || !!errors?.sum) {
      [
        ...(([
          errors?.sum,
        ] as (keyof typeof localizedErrors.validationError)[]) ?? []),
        ...((tableErrors?.borrowMoney as (keyof typeof localizedErrors.validationError)[]) ??
          []),
        ...((tableErrors?.landMoney as (keyof typeof localizedErrors.validationError)[]) ??
          []),
        ...((tableErrors?.isActive as (keyof typeof localizedErrors.validationError)[]) ??
          []),
      ].forEach((error) =>
        enqueueSnackbar(
          common(`validationError.${error}` as TFuncKey<"common">) as string,
          { variant: "error" }
        )
      );
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
    try {
      await onSubmit(data);
    } catch (error) {
      if (isErrorRs(error) && error.validationMessages) {
        setErrorState(error.validationMessages);
        delete error.validationMessages.name;
        Object.values(error.validationMessages).forEach((error) =>
          enqueueSnackbar(error, { variant: "error" })
        );
      }
    }
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

  const datePickerInput: (props: MuiTextFieldPropsType) => ReactElement =
    useCallback(
      (params) => (
        <TextField
          {...params}
          error={!!errorState?.date}
          helperText={
            errorState?.date
              ? (common(
                  `validationError.${errorState?.date}` as TFuncKey<"common">
                ) as string)
              : undefined
          }
        />
      ),
      [errorState?.date, common]
    );

  const allActiveHandler = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => ({
        ...prevState,
        records: prevState.records.map((item) => ({
          ...item,
          isActive: target.checked,
        })),
      }));
    },
    []
  );

  const dateHandler = useCallback(
    (date: Date | null) => setState((prevState) => ({ ...prevState, date })),
    []
  );

  return (
    <FormWrapper
      onSubmit={submitHandler}
      submitText={
        activity?.id ? common("button.edit") : common("button.create")
      }
    >
      <TextInput<ActivityForm, RecordItemForm & ActivityForm>
        name="name"
        label={trip("activity.title")}
        errorState={errorState}
        state={state}
        onChange={onNameChange}
      />
      <Stack
        direction="row"
        spacing={2}
        sx={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(1) }}
      >
        <LocalizationProvider
          adapterLocale={i18n.language.includes("en") ? en : ru}
          dateAdapter={AdapterDateFns}
        >
          <DatePicker
            label={trip("activity.date")}
            onChange={dateHandler}
            renderInput={datePickerInput}
            value={state.date}
          />
        </LocalizationProvider>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          {trip("activity.amount", { amount: state.sum })}
        </Typography>
      </Stack>
      <Table
        sx={{ minWidth: 300, paddingLeft: 1, paddingRight: 1 }}
        aria-label={trip("ariaLabel.simpleTable")}
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
            <StyledTableCell>{trip("activity.name")}</StyledTableCell>
            <Tooltip title={trip("activity.spendTooltip")}>
              <StyledTableCell>{trip("activity.spend")}</StyledTableCell>
            </Tooltip>
            <Tooltip title={trip("activity.payTooltip")}>
              <StyledTableCell>{trip("activity.pay")}</StyledTableCell>
            </Tooltip>
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
    </FormWrapper>
  );
};

SaveAction.muiName = FormWrapper.muiName;

export default SaveAction;
