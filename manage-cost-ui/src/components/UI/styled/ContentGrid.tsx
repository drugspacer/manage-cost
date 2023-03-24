import { styled } from "@mui/material";
import Grid, { GridProps } from "@mui/material/Grid";

type ContentGridProps = GridProps & {
  rightSpacing?: number;
};

const ContentGrid = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "rightSpacing",
})<ContentGridProps>(({ rightSpacing = 2, theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingRight: theme.spacing(rightSpacing),
  },
  [theme.breakpoints.up("sm")]: {
    paddingRight: theme.spacing(rightSpacing),
  },
}));

export default ContentGrid;
