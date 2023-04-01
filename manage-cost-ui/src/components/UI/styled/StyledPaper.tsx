import { styled } from "@mui/material";
import Paper from "@mui/material/Paper";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(5)}`,
}));

export default StyledPaper;
