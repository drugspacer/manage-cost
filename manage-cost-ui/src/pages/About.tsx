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
import ContentItemWrapper from "../components/HOC/ContentItemWrapper";

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

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const nextButton = useMemo(
    () => (
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
    ),
    [activeStep === maxSteps - 1, handleNext, about, theme.direction]
  );

  const backButton = useMemo(
    () => (
      <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
        {about("button.back")}
      </Button>
    ),
    [activeStep === 0, about, theme.direction, handleBack]
  );

  const content = [
    <SwipeableViews
      key="views"
      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
      index={activeStep}
      onChangeIndex={handleStepChange}
      enableMouseEvents
    >
      {ContentItemWrapper({ keyPrefix: "tab1", size: 3 })}
      {ContentItemWrapper({ keyPrefix: "tab2", size: 3, simple: false })}
      {ContentItemWrapper({ keyPrefix: "tab3", size: 4, hasText: true })}
      {ContentItemWrapper({ keyPrefix: "tab4", size: 3, hasText: true })}
      {ContentItemWrapper({ keyPrefix: "tab5", size: 1, hasText: true })}
      {ContentItemWrapper({ keyPrefix: "tab6", size: 3, hasText: true })}
      {ContentItemWrapper({ keyPrefix: "tab7", size: 3 })}
      {ContentItemWrapper({ keyPrefix: "tab8", size: 4 })}
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
