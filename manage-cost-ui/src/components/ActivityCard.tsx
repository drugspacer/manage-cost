import React, { memo, MouseEventHandler } from "react";
import Activity from "../models/activity.model";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CardHeader from "@mui/material/CardHeader";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { TFuncKey } from "i18next";

type ActivityCardProp = {
  activity: Activity;
  isArchive: boolean;
  onEditAction: MouseEventHandler<HTMLButtonElement>;
  onDelete?: MouseEventHandler<HTMLButtonElement>;
};

const ActivityCard = ({
  activity,
  isArchive,
  onEditAction,
  onDelete,
}: ActivityCardProp) => {
  const { t: common, i18n } = useTranslation();
  const { t: trip } = useTranslation("trip");

  const tableContent = activity.records.map((row, index) => (
    <TableRow
      key={index}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {row.person.name}
      </TableCell>
      <TableCell>{row.borrowMoney}</TableCell>
      <TableCell>{row.landMoney}</TableCell>
    </TableRow>
  ));

  const buttons = (
    <>
      {!isArchive && (
        <Tooltip title={common("button.edit")}>
          <IconButton onClick={onEditAction}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
      {!isArchive && (
        <Tooltip title={common("button.delete")}>
          <IconButton onClick={onDelete}>
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title={activity.name} action={buttons} />
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <List>
            <ListItemText
              primary={activity.date.toLocaleDateString(i18n.language)}
              secondary={activity.sum}
            />
          </List>
          {activity.tag && (
            <Chip
              variant="outlined"
              label={
                trip(`tag.${activity.tag.name}` as TFuncKey<"trip">) as string
              }
            />
          )}
        </Stack>
        {!isArchive && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{trip("activity.name")}</TableCell>
                <TableCell>{trip("activity.spend")}</TableCell>
                <TableCell>{trip("activity.pay")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{tableContent}</TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

ActivityCard.muiName = "Card";

export default memo(ActivityCard);
