import { styled } from "@mui/material";
import Grid, { GridProps } from "@mui/material/Grid";
import { AllSystemCSSProperties } from "@mui/system/styleFunctionSx/styleFunctionSx";

type ItemGridProps = GridProps & {
  isFullMobile?: boolean;
  flexBasis?: AllSystemCSSProperties["flexBasis"];
};

const ItemGrid = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "isFullMobile" && prop !== "flexBasis",
})<ItemGridProps>(({ theme, isFullMobile = false, flexBasis }) => ({
  [theme.breakpoints.down("sm")]: {
    flexBasis: isFullMobile ? "100%" : flexBasis,
  },
  [theme.breakpoints.up("sm")]: {
    flexBasis,
  },
}));

export default ItemGrid;
