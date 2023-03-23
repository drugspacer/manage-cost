import React, {
  DOMAttributes,
  MouseEventHandler,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import Button from "@mui/material/Button";
import {
  deleteActivity,
  finishTrip,
  getTrip,
  returnFromArchive,
  saveActivity,
  updateActivity,
  updateTrip,
} from "../api/trips";
import { useParams } from "react-router";
import Grid from "@mui/material/Grid";
import Page from "../components/Layout/Page";
import UIModal from "../components/UI/UIModal";
import SaveAction from "../components/forms/SaveAction";
import ActivityCard from "../components/ActivityCard";
import SaveTrip from "../components/forms/SaveTrip";
import Trip, { TripRs } from "../models/trip.model";
import ArchiveWrapper from "../components/Layout/ArchiveWrapper";
import tripRsToTrip from "../functions/apiTransform";
import Activity from "../models/activity.model";
import CardActionArea from "@mui/material/CardActionArea";
import Card from "@mui/material/Card";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DialogWrapper from "../components/HOC/DialogWrapper";

enum MODAL_TYPE {
  EDIT_TRIP = "Редактировать поездку",
  EDIT_ACTION = "Редактировать мероприятие",
  ADD_ACTION = "Добавить запись",
}

const Trip: React.FC = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState<MODAL_TYPE | undefined>();
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  console.log(trip);

  useEffect(() => {
    setIsLoading(true);
    getTrip(id).then((data) => {
      setTrip(tripRsToTrip(data));
      setIsLoading(false);
    });
  }, []);

  const handleButton: (
    func: (id: string | undefined) => Promise<TripRs>
  ) => DOMAttributes<HTMLButtonElement>["onClick"] = useCallback(
    (func) => () => {
      setIsLoading(true);
      func(trip?.id).then((data) => {
        setTrip(tripRsToTrip(data));
        setIsLoading(false);
      });
    },
    [trip?.id]
  );

  const modalButtonHandler = useCallback(
    (modalType: MODAL_TYPE) => () => setModalType(modalType),
    []
  );

  const persons = trip ? trip.persons.map((item) => item.person) : [];

  const submitHandler: <T extends object>(
    func: (request: T, id?: string) => Promise<TripRs>
  ) => (data: T) => void = useCallback(
    (func) => async (data) => {
      setIsLoading(true);
      const response = await func(data, trip?.id);
      setModalType(undefined);
      setSelectedActivity(undefined);
      setTrip(tripRsToTrip(response));
      setIsLoading(false);
    },
    [trip?.id]
  );

  const deleteActivityHandler = useCallback(
    (tripId: string, activityId: string): (() => void) =>
      async () => {
        setIsLoading(true);
        const data = await deleteActivity(tripId, activityId);
        setTrip(tripRsToTrip(data));
        setIsLoading(false);
      },
    []
  );

  const editActionHandler = useCallback(
    (activity: Activity): MouseEventHandler<HTMLButtonElement> =>
      () => {
        setSelectedActivity(activity);
        setModalType(MODAL_TYPE.EDIT_ACTION);
      },
    []
  );

  const modalDataRender = (
    type: MODAL_TYPE | undefined
  ): ReactElement | undefined => {
    switch (type) {
      case MODAL_TYPE.ADD_ACTION: {
        return (
          <SaveAction
            onSubmit={submitHandler(saveActivity)}
            persons={persons}
          />
        );
      }
      case MODAL_TYPE.EDIT_TRIP: {
        const { persons, ...rest } = trip!;
        return (
          <SaveTrip
            onSubmit={submitHandler(updateTrip)}
            trip={{ persons: persons.map(({ person }) => person), ...rest }}
          />
        );
      }
      case MODAL_TYPE.EDIT_ACTION: {
        return (
          <SaveAction
            onSubmit={submitHandler(updateActivity)}
            persons={persons}
            activity={selectedActivity}
          />
        );
      }
    }
  };

  let content = null;
  const buttons = [];

  if (!isLoading && trip !== undefined) {
    const cards = trip.activities.map((item) => (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={item.id}>
        <DialogWrapper onDelete={deleteActivityHandler(trip.id!, item.id)}>
          <ActivityCard
            activity={item}
            isArchive={trip.archive}
            onEditAction={editActionHandler(item)}
          />
        </DialogWrapper>
      </Grid>
    ));

    if (!trip.archive) {
      cards.push(
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key="new">
          <Card sx={{ height: "100%" }}>
            <CardActionArea
              onClick={modalButtonHandler(MODAL_TYPE.ADD_ACTION)}
              sx={{ height: "100%" }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AddOutlinedIcon color="action" fontSize="large" />
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Добавить
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      );
    }

    content = <ArchiveWrapper trip={trip}>{cards}</ArchiveWrapper>;
    if (trip.archive) {
      buttons.push(
        <Button
          key="finish"
          color="inherit"
          onClick={handleButton(returnFromArchive)}
        >
          Вернуть из архива
        </Button>
      );
    } else {
      buttons.push(
        <Button
          key="edit"
          color="inherit"
          onClick={modalButtonHandler(MODAL_TYPE.EDIT_TRIP)}
        >
          {MODAL_TYPE.EDIT_TRIP}
        </Button>,
        <Button
          key="create"
          color="inherit"
          onClick={modalButtonHandler(MODAL_TYPE.ADD_ACTION)}
        >
          {MODAL_TYPE.ADD_ACTION}
        </Button>,
        <Button key="finish" color="inherit" onClick={handleButton(finishTrip)}>
          Завершить поездку
        </Button>
      );
    }
  }

  const breadcrumbs = [
    { href: "/", label: "Поездки" },
    { href: `/trip/${id}`, label: trip?.name ?? "Поездка" },
  ];

  return (
    <Page buttons={buttons} breadcrumbs={breadcrumbs}>
      {content}
      <UIModal
        isOpen={!!modalType}
        onClose={() => setModalType(undefined)}
        title={modalType}
      >
        {modalDataRender(modalType)}
      </UIModal>
    </Page>
  );
};

export default Trip;
