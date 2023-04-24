import React, { useCallback, useMemo } from "react";
import Page from "../components/Layout/Page";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useTheme } from "@mui/material";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Button from "@mui/material/Button";
import SwipeableViews from "react-swipeable-views";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import Theme from "../themes/theme";
import generateContentItem from "../components/HOC/generateContentItem";

const contentArr = [
  ...generateContentItem("tab1", 3),
  ...generateContentItem("tab2", 3, false, false),
  ...generateContentItem("tab3", 4, true),
  ...generateContentItem("tab4", 3, true),
  ...generateContentItem("tab5", 1, true),
  ...generateContentItem("tab6", 3, true),
  ...generateContentItem("tab7", 3),
  ...generateContentItem("tab8", 4),
];

const About = () => {
  const navigate = useNavigate();
  const { t: about } = useTranslation("about");
  const { t: common } = useTranslation();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const isMobile = useMediaQuery((theme: typeof Theme) =>
    theme.breakpoints.down("sm")
  );
  const maxSteps = 10;

  const backHandler = useCallback(() => navigate(-1), []);

  const buttons = useMemo(
    () => [
      {
        text: common("button.back"),
        handler: backHandler,
        element: (
          <IconButton
            size="large"
            color="inherit"
            onClick={backHandler}
            key="back"
          >
            <ArrowBackOutlinedIcon />
          </IconButton>
        ),
      },
    ],
    [backHandler, common]
  );

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleStepChange = useCallback((step: number) => {
    setActiveStep(step);
  }, []);

  const nextButton = (
    <Button
      size="small"
      onClick={handleNext}
      disabled={activeStep === maxSteps - 1}
    >
      {about("button.next")}
      {theme.direction === "rtl" ? (
        <KeyboardArrowLeft />
      ) : (
        <KeyboardArrowRight />
      )}
    </Button>
  );

  const backButton = (
    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
      {theme.direction === "rtl" ? (
        <KeyboardArrowRight />
      ) : (
        <KeyboardArrowLeft />
      )}
      {about("button.back")}
    </Button>
  );

  const content = [
    <SwipeableViews
      key="views"
      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
      index={activeStep}
      onChangeIndex={handleStepChange}
      enableMouseEvents
    >
      {contentArr.map((Item, index) =>
        Math.abs(activeStep - index) === 0 ? Item : null
      )}
    </SwipeableViews>,
    <MobileStepper
      key="stepper"
      steps={maxSteps}
      position="static"
      activeStep={activeStep}
      nextButton={nextButton}
      backButton={backButton}
    />,
  ];

  return (
    <Page buttons={buttons} header={about("header")}>
      <Container maxWidth="md" disableGutters>
        {isMobile ? content : <Paper variant="outlined">{content}</Paper>}
      </Container>
    </Page>
  );
};

export default About;
