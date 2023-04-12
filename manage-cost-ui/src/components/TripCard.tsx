import Card from "@mui/material/Card";
import React, { memo, MouseEventHandler } from "react";
import Trip from "../models/trip.model";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";

const TripCard = ({
  trip,
  onDelete,
}: {
  trip: Omit<Trip, "isArchive">;
  onDelete?: MouseEventHandler<HTMLButtonElement>;
}) => {
  const navigate = useNavigate();
  const { t: common } = useTranslation();
  const { t: tripTranslation } = useTranslation("trip", { keyPrefix: "trip" });

  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea
        component="div"
        onClick={() => navigate(`/trip/${trip.id}`)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <CardHeader
          title={trip.name}
          sx={{ width: "100%" }}
          action={
            <Tooltip title={tripTranslation("delete")}>
              <IconButton
                aria-label={common("ariaLabel.delete")}
                onClick={onDelete}
              >
                <DeleteOutlinedIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            <Typography>{trip.place}</Typography>
            <Typography>
              {trip.persons.map(({ person }) => person.name).join(", ")}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

TripCard.muiName = "Card";

export default memo(TripCard);
