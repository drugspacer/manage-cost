import React from "react";
import Trip from "../models/trip.model";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PersonTrip from "../models/personTrip.model";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import { useTranslation } from "react-i18next";

type PersonTable = {
  name: string;
  toName: string;
  amount: string;
};

const generateTableData = (persons: PersonTrip[]): PersonTable[] => {
  const result: PersonTable[] = [];
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
          result.push({
            name: person.name,
            amount: Math.abs(sum).toFixed(2),
            toName: landed[landIndex].person.name,
          });
          landed[landIndex].sum += sum;
          return;
        }
        landIndex++;
      }
      landIndex = 0;
      while (landIndex < landed.length) {
        if (landed[landIndex].sum + sum < 0) {
          result.push({
            name: person.name,
            amount: landed[landIndex].sum.toFixed(2),
            toName: landed[landIndex].person.name,
          });
          sum += landed[landIndex].sum;
          landIndex++;
        } else {
          result.push({
            name: person.name,
            amount: Math.abs(sum).toFixed(2),
            toName: landed[landIndex].person.name,
          });
          landed[landIndex].sum += sum;
          return;
        }
      }
    });
  return result;
};

const Result = ({ persons }: Pick<Trip, "persons">) => {
  const { t } = useTranslation("trip", { keyPrefix: "result" });

  const tableData = generateTableData(persons);

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("who")}</TableCell>
              <TableCell>{t("whom")}</TableCell>
              <TableCell>{t("amount")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map(({ name, toName, amount }, index) => (
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
                  {amount}
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
