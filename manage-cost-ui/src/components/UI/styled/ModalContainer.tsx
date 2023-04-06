import { styled } from "@mui/material";
import Box from "@mui/material/Box";

const ModalContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(3),
  },
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  backgroundColor: theme.palette.background.paper,
  border: "2px solid #000",
  maxWidth: "90vw",
  padding: theme.spacing(4),
  boxShadow: "24px",
})) as typeof Box;

export default ModalContainer;
