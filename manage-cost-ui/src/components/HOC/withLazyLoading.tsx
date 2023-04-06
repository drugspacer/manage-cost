import CircularProgress from "@mui/material/CircularProgress";
import React, { FC, Suspense } from "react";

const withLazyLoading = (Component: FC) => {
  console.log("withLazyLoading render");
  return (
    <Suspense fallback={<CircularProgress />}>
      <Component />
    </Suspense>
  );
};

export default withLazyLoading;
