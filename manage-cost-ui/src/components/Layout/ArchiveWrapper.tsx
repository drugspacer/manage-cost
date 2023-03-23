import React, { FC, PropsWithChildren } from "react";
import Grid from "@mui/material/Grid";
import Result from "../Result";
import Trip from "../../models/trip.model";

const ArchiveWrapper: FC<
  PropsWithChildren<{ trip: Pick<Trip, "persons" | "archive"> }>
> = ({ trip, children }) => {
  return trip.archive ? (
    <Grid container spacing={4} justifyContent="space-evenly">
      <Grid item xs={4}>
        <Grid spacing={2} container direction="column">
          {children}
        </Grid>
      </Grid>
      <Grid item xs>
        <Result persons={trip.persons} />
      </Grid>
    </Grid>
  ) : (
    <Grid spacing={2} container>
      {children}
    </Grid>
  );
};

export default ArchiveWrapper;
