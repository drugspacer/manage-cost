import Card from "@mui/material/Card";
import React, { FC } from "react";
import ITrip from "../models/trip.model";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardActionArea from "@mui/material/CardActionArea";

const TripCard: FC<{ trip: Omit<ITrip, "isArchive"> }> = ({ trip }) => (
  <Card>
    <CardActionArea>
      <CardHeader title={trip.place}/>
      <CardContent>
        <Typography>{trip.participants.join(", ")}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default TripCard;
