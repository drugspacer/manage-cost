import React, { memo, PropsWithChildren } from "react";
import Grid from "@mui/material/Grid";
import Result from "../Result";
import Trip from "../../models/trip.model";
import ContentGrid from "../UI/styled/ContentGrid";

const ArchiveWrapper = ({
  trip,
  children,
}: PropsWithChildren<{ trip: Pick<Trip, "persons" | "archive"> }>) =>
  trip.archive ? (
    <ContentGrid
      container
      spacing={4}
      justifyContent="space-evenly"
      rightSpacing={4}
      direction="row-reverse"
    >
      <Grid item xs={12} sm={7} md={8} lg={9} xl={10}>
        <Result persons={trip.persons} />
      </Grid>
      <Grid item xs={12} sm={5} md={4} lg={3} xl={2}>
        <Grid spacing={2} container direction="column">
          {children}
        </Grid>
      </Grid>
    </ContentGrid>
  ) : (
    <ContentGrid spacing={2} container>
      {children}
    </ContentGrid>
  );

ArchiveWrapper.muiName = "Grid";

export default memo(ArchiveWrapper);
