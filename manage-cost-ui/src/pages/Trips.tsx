import Grid from "@mui/material/Grid";
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import TripCard from "../components/TripCard";
import Button from "@mui/material/Button";
import SaveTrip from "../components/forms/SaveTrip";
import Page from "../components/Layout/Page";
import UIModal from "../components/UI/UIModal";
import Trip from "../models/trip.model";
import { TripForm } from "../models/form.model";
import DeleteDialogWrapper from "../components/HOC/DeleteDialogWrapper";
import CircularProgress from "@mui/material/CircularProgress";
import { ButtonProp } from "../models/ui.model";
import ContentGrid from "../components/UI/styled/ContentGrid";
import { isTrip, isTrips } from "../functions/assertions";
import TripApi from "../service/api/trip";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/Auth";

const Trips: FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation("trip");
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  useEffect(() => {
    TripApi.getTrips()
      .then((data) => {
        isTrips(data);
        setTrips(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const submitHandler = async (request: TripForm) => {
    setIsLoading(true);
    try {
      const data = await TripApi.saveTrip(request);
      console.log(data);
      isTrip(data);
      setTrips((prevState) => [...prevState, data]);
      if (
        data.user.persons.some(
          ({ name }) =>
            user?.persons.findIndex((item) => item.name === name) === -1
        )
      ) {
        setUser(user);
      }
    } finally {
      setIsLoading(false);
      setOpenModal(false);
    }
  };

  const deleteHandler =
    (id: string): (() => void) =>
    async () => {
      setIsLoading(true);
      try {
        await TripApi.deleteTrip(id);
        setTrips((prevState) => prevState.filter((item) => item.id !== id));
      } finally {
        setIsLoading(false);
      }
    };

  const openHandler = useCallback(() => setOpenModal(true), []);

  const content = isLoading ? (
    <CircularProgress />
  ) : (
    <ContentGrid container spacing={2}>
      {trips.map((item) => {
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={item.id}>
            <DeleteDialogWrapper
              onDelete={deleteHandler(item.id)}
              header={t("deleteDialog")}
            >
              <TripCard trip={item} />
            </DeleteDialogWrapper>
          </Grid>
        );
      })}
    </ContentGrid>
  );

  const buttons: ButtonProp[] = useMemo(
    () => [
      {
        element: (
          <Button key="create" color="inherit" onClick={openHandler}>
            {t("trip.create")}
          </Button>
        ),
        text: t("trip.create"),
        handler: openHandler,
      },
    ],
    [openHandler, t]
  );

  const breadcrumbs = useMemo(
    () => [{ href: "/", label: t("trip.item_other") }],
    [t]
  );

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
