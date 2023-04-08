import Grid from "@mui/material/Grid";
import React, { FC, useCallback, useEffect, useState } from "react";
import TripCard from "../components/TripCard";
import Button from "@mui/material/Button";
import SaveTrip from "../components/forms/SaveTrip";
import Page from "../components/Layout/Page";
import UIModal from "../components/UI/UIModal";
import Trip from "../models/trip.model";
import { tripRsToTrip } from "../functions/apiTransform";
import { TripRq } from "../models/form.model";
import DeleteDialogWrapper from "../components/HOC/DeleteDialogWrapper";
import CircularProgress from "@mui/material/CircularProgress";
import { ButtonProp } from "../models/ui.model";
import ContentGrid from "../components/UI/styled/ContentGrid";
import { isTripRs } from "../functions/assertions";
import TripApi from "../service/api/trip";
import { useTranslation } from "react-i18next";

type AssertIsTripArr = (trips?: Trip[]) => asserts trips is Trip[];

const isTrips: AssertIsTripArr = (trips) => {
  if (trips === undefined) {
    throw new Error("trips is undefined");
  }
};

const Trips: FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation("trip");

  useEffect(() => {
    TripApi.getTrips()
      .then((data) => {
        isTrips(data);
        setTrips(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const submitHandler = async (request: TripRq) => {
    setIsLoading(true);
    try {
      const data = await TripApi.saveTrip(request);
      isTripRs(data);
      setTrips((prevState) => [...prevState, tripRsToTrip(data)]);
    } finally {
      setIsLoading(false);
      setOpenModal(false);
    }
  };

  const deleteHandler = useCallback(
    (id: string): (() => void) =>
      async () => {
        setIsLoading(true);
        try {
          await TripApi.deleteTrip(id);
          setTrips((prevState) => prevState.filter((item) => item.id !== id));
        } finally {
          setIsLoading(false);
        }
      },
    []
  );

  const openHandler = useCallback(() => setOpenModal(true), []);

  let content;

  if (!isLoading) {
    content = (
      <ContentGrid container spacing={2}>
        {trips.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={item.id}>
            <DeleteDialogWrapper
              onDelete={deleteHandler(item.id)}
              header={t("deleteDialog")}
            >
              <TripCard trip={item} />
            </DeleteDialogWrapper>
          </Grid>
        ))}
      </ContentGrid>
    );
  } else {
    content = <CircularProgress />;
  }

  const buttons: ButtonProp[] = [
    {
      element: (
        <Button key="create" color="inherit" onClick={openHandler}>
          {t("trip.create")}
        </Button>
      ),
      text: t("trip.create"),
      handler: openHandler,
    },
  ];

  const breadcrumbs = [{ href: "/", label: t("trip.item_other") }];

  console.log("Trips render");

  return (
    <Page buttons={buttons} breadcrumbs={breadcrumbs}>
      {content}
      <UIModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={t("trip.create")}
      >
        <SaveTrip onSubmit={submitHandler} />
      </UIModal>
    </Page>
  );
};

export default Trips;
