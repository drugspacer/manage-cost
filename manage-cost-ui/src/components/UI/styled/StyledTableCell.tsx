import { styled } from "@mui/material";
import TableCell from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
})) as typeof TableCell;

export default StyledTableCell;
