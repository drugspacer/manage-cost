import React, { useCallback, useMemo, useState } from "react";
import Trip from "../models/trip.model";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import { useTranslation } from "react-i18next";
import Chart from "./data/Chart";
import currency from "../constants/currency";
import CurrencyAutocomplete from "./input/CurrencyAutocomplete";
import { AutocompleteValue } from "@mui/base/useAutocomplete/useAutocomplete";
import CurrencyApi from "../service/api/currency";
import { isCurrencyResponse } from "../functions/assertions";
import Skeleton from "@mui/material/Skeleton";

type PersonTable = [
  {
    name: string;
    toName: string;
  }[],
  number[]
];

const Result = ({
  persons,
  activities,
  currency: defaultCurCode,
}: Pick<Trip, "persons" | "activities" | "currency">) => {
  const { t } = useTranslation("trip", { keyPrefix: "result" });

  const tableData = useMemo(() => {
    const result: PersonTable = [[], []];
    const landed = persons
      .filter(({ sum }) => sum > 0)
      .sort((a, b) => a.sum - b.sum)
      .map((item) => ({ ...item }));
    let landIndex = 0;
    persons
      .filter(({ sum }) => sum < 0)
      .sort((a, b) => b.sum - a.sum)
      .forEach(({ person, sum }) => {
        while (landIndex < landed.length) {
          if (landed[landIndex].sum + sum >= 0) {
            result[0].push({
              name: person.name,
              toName: landed[landIndex].person.name,
            });
            result[1].push(Math.abs(sum));
            landed[landIndex].sum += sum;
            return;
          }
          landIndex++;
        }
        landIndex = 0;
        while (landIndex < landed.length) {
          if (landed[landIndex].sum + sum < 0) {
            result[0].push({
              name: person.name,
              toName: landed[landIndex].person.name,
            });
            result[1].push(landed[landIndex].sum);
            sum += landed[landIndex].sum;
            landIndex++;
          } else {
            result[0].push({
              name: person.name,
              toName: landed[landIndex].person.name,
            });
            result[1].push(Math.abs(sum));
            landed[landIndex].sum += sum;
            return;
          }
        }
      });
    return result;
  }, [persons]);

  const chartData = useMemo(() => {
    return activities.reduce<Map<string, number>>((acc, item) => {
      const key = item.tag?.name ?? "OTHER";
      return acc.has(key)
        ? acc.set(key, acc.get(key)! + item.sum)
        : acc.set(key, item.sum);
    }, new Map<string, number>());
  }, [activities]);

  const [amounts, setAmounts] = useState<number[]>(tableData[1]);
  const [curCode, setCurrency] =
    useState<keyof typeof currency>(defaultCurCode);
  const [loading, setLoading] = useState(false);

  const changeHandler = useCallback(
    async (
      _e: React.SyntheticEvent,
      value: AutocompleteValue<keyof typeof currency, false, true, false>
    ) => {
      setLoading(true);
      try {
        const result = await CurrencyApi.exchangeRate(defaultCurCode, value);
        console.log(result);
        isCurrencyResponse<typeof value>(result);
        setAmounts(
          tableData[1].map(
            (amount) =>
              (amount / result.rates[defaultCurCode]) * result.rates[value]
          )
        );
        setCurrency(value);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <Card>
      <CardContent>
        {chartData.size > 1 && <Chart data={chartData} />}
        <CurrencyAutocomplete value={curCode} onChange={changeHandler} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("who")}</TableCell>
              <TableCell>{t("whom")}</TableCell>
              <TableCell>{t("amount")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData[0].map(({ name, toName }, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {toName}
                </TableCell>
                <TableCell component="th" scope="row">
                  {loading ? (
                    <Skeleton />
                  ) : (
                    `${amounts[index].toFixed(2)}${currency[curCode]}`
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

Result.muiName = "Card";

export default Result;
