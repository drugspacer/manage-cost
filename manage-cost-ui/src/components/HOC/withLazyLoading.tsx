import CircularProgress from "@mui/material/CircularProgress";
import React, { FC, Suspense } from "react";

const withLazyLoading = (Component: FC) => (
  <Suspense fallback={<CircularProgress />}>
    <Component />
  </Suspense>
);

export default withLazyLoading;
