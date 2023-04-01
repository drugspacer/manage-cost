import Grid from "@mui/material/Grid";
import React, { FC, useCallback, useEffect, useState } from "react";
import TripCard from "../components/TripCard";
import Button from "@mui/material/Button";
import SaveTrip from "../components/forms/SaveTrip";
import Page from "../components/Layout/Page";
import UIModal from "../components/UI/UIModal";
import Trip from "../models/trip.model";
import { deleteTrip, getTrips, saveTrip } from "../api/trips";
import { tripRsToTrip } from "../functions/apiTransform";
import { TripRq } from "../models/form.model";
import DialogWrapper from "../components/HOC/DialogWrapper";
import CircularProgress from "@mui/material/CircularProgress";
import { ButtonProp } from "../models/ui.model";
import ContentGrid from "../components/UI/styled/ContentGrid";

const Trips: FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getTrips().then((data) => {
      setTrips(data);
      setIsLoading(false);
    });
  }, []);

  const submitHandler = async (request: TripRq) => {
    setIsLoading(true);
    const data = await saveTrip(request);
    setIsLoading(false);
    setTrips((prevState) => [...prevState, tripRsToTrip(data)]);
    setOpenModal(false);
  };

  const deleteHandler = useCallback(
    (id: string): (() => void) =>
      async () => {
        setIsLoading(true);
        await deleteTrip(id);
        setTrips((prevState) => prevState.filter((item) => item.id !== id));
        setIsLoading(false);
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
            <DialogWrapper onDelete={deleteHandler(item.id)}>
              <TripCard trip={item} />
            </DialogWrapper>
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
          Создать поездку
        </Button>
      ),
      text: "Создать поездку",
      handler: openHandler,
    },
  ];

  const breadcrumbs = [{ href: "/", label: "Поездки" }];

  return (
    <Page buttons={buttons} breadcrumbs={breadcrumbs}>
      {content}
      <UIModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Создать поездку"
      >
        <SaveTrip onSubmit={submitHandler} />
      </UIModal>
    </Page>
  );
};

export default Trips;
