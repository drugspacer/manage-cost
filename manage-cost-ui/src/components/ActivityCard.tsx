import React, { memo, MouseEventHandler } from "react";
import Activity from "../models/activity.model";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
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
        <Tooltip title="Редактировать">
          <IconButton onClick={onEditAction}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
      {!isArchive && (
        <Tooltip title="Удалить">
          <IconButton onClick={onDelete}>
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  console.log("ActivityCard render");

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title={activity.name} action={buttons} />
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary">
          {activity.date.toLocaleDateString("ru-RU")}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {activity.sum}
        </Typography>
        {!isArchive && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Имя</TableCell>
                <TableCell>Потрачено</TableCell>
                <TableCell>Заплачено</TableCell>
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
