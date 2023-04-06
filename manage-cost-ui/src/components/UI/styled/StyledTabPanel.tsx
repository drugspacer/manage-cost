import { styled } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";

const StyledTabPanel = styled(TabPanel)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  width: "100%",
})) as typeof TabPanel;

export default StyledTabPanel;
