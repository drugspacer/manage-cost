import React, {
  MouseEventHandler,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router";
import Grid from "@mui/material/Grid";
import Page from "../components/Layout/Page";
import UIModal from "../components/UI/UIModal";
import SaveAction from "../components/forms/SaveAction";
import ActivityCard from "../components/ActivityCard";
import SaveTrip from "../components/forms/SaveTrip";
import Trip from "../models/trip.model";
import ArchiveWrapper from "../components/Layout/ArchiveWrapper";
import Activity from "../models/activity.model";
import CardActionArea from "@mui/material/CardActionArea";
import Card from "@mui/material/Card";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DeleteDialogWrapper from "../components/HOC/DeleteDialogWrapper";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tooltip } from "@mui/material";
import { isTrip } from "../functions/assertions";
import TripApi from "../service/api/trip";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/Auth";

enum MODAL_TYPE {
  EDIT_TRIP = "Редактировать поездку",
  EDIT_ACTION = "Редактировать мероприятие",
  ADD_ACTION = "Добавить запись",
}

const Trip: React.FC = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState<MODAL_TYPE | undefined>();
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const { t: common } = useTranslation();
  const { t: tripTranslate } = useTranslation("trip");
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  useEffect(() => {
    TripApi.getTrip(id)
      .then((data) => {
        isTrip(data);
        setTrip(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleButton: (
    func: (id: string | undefined) => Promise<Trip | undefined>
  ) => () => void = useCallback(
    (func) => async () => {
      setIsLoading(true);
      try {
        const data = await func(trip?.id);
        isTrip(data);
        setTrip(data);
      } finally {
        setIsLoading(false);
      }
    },
    [trip?.id]
  );

  const modalButtonHandler = useCallback(
    (modalType: MODAL_TYPE) => () => setModalType(modalType),
    []
  );

  const submitHandler: <T extends object>(
    func: (request: T, id?: string) => Promise<Trip | undefined>
  ) => (data: T) => void = useCallback(
    (func) => async (data) => {
      setIsLoading(true);
      try {
        const response = await func(data, trip?.id);
        isTrip(response);
        setTrip(response);
        if (
          response.user.persons.some(
            ({ name }) =>
              user?.persons.findIndex((item) => item.name === name) === -1
          )
        ) {
          setUser(user);
        }
      } finally {
        setModalType(undefined);
        setSelectedActivity(undefined);
        setIsLoading(false);
      }
    },
    [trip?.id]
  );

  const deleteActivityHandler = useCallback(
    (tripId: string, activityId: string): (() => void) =>
      async () => {
        setIsLoading(true);
        try {
          const trip = await TripApi.deleteActivity(tripId, activityId);
          isTrip(trip);
          setTrip(trip);
        } finally {
          setIsLoading(false);
        }
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

  const persons = trip ? trip.persons.map((item) => item.person) : [];

  const modalDataRender = (
    type: MODAL_TYPE | undefined
  ): ReactElement | undefined => {
    switch (type) {
      case MODAL_TYPE.ADD_ACTION: {
        return (
          <SaveAction
            onSubmit={submitHandler(TripApi.saveActivity)}
            persons={persons}
          />
        );
      }
      case MODAL_TYPE.EDIT_TRIP: {
        const { persons, ...rest } = trip!;
        return (
          <SaveTrip
            onSubmit={submitHandler(TripApi.updateTrip)}
            trip={{ persons: persons.map(({ person }) => person), ...rest }}
          />
        );
      }
      case MODAL_TYPE.EDIT_ACTION: {
        return (
          <SaveAction
            onSubmit={submitHandler(TripApi.updateActivity)}
            persons={persons}
            activity={selectedActivity}
          />
        );
      }
    }
  };

  const cards = useMemo(() => {
    const cards =
      !isLoading && trip !== undefined
        ? trip.activities.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={item.id}>
              <DeleteDialogWrapper
                onDelete={deleteActivityHandler(trip.id!, item.id)}
                header={tripTranslate("deleteDialog")}
              >
                <ActivityCard
                  activity={item}
                  isArchive={trip.archive}
                  onEditAction={editActionHandler(item)}
                />
              </DeleteDialogWrapper>
            </Grid>
          ))
        : undefined;
    if (!!cards && !trip!.archive) {
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
                  {tripTranslate("trip.add")}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      );
    }
    return cards;
  }, [
    isLoading,
    trip,
    deleteActivityHandler,
    modalButtonHandler,
    editActionHandler,
    tripTranslate,
  ]);

  const content = useMemo(() => {
    if (isLoading) {
      return <CircularProgress />;
    } else if (!!trip) {
      return <ArchiveWrapper trip={trip}>{cards}</ArchiveWrapper>;
    }
    return null;
  }, [trip, cards, isLoading]);

  const mainButton = useMemo(() => {
    if (trip === undefined) {
      return undefined;
    } else if (trip.archive) {
      return {
        text: tripTranslate("trip.returnFromArchive"),
        handler: handleButton(TripApi.returnFromArchive),
      };
    }
    return {
      text: tripTranslate("trip.end"),
      handler: handleButton(TripApi.finishTrip),
    };
  }, [trip?.archive, handleButton, tripTranslate]);

  const buttons = useMemo(
    () =>
      trip === undefined || trip.archive
        ? []
        : [
            {
              element: (
                <Tooltip title={MODAL_TYPE.EDIT_TRIP} key="edit">
                  <IconButton
                    size="large"
                    color="inherit"
                    aria-label={common("ariaLabel.edit")}
                    sx={{ mr: 2 }}
                    onClick={modalButtonHandler(MODAL_TYPE.EDIT_TRIP)}
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                </Tooltip>
              ),
              text: MODAL_TYPE.EDIT_TRIP,
              handler: modalButtonHandler(MODAL_TYPE.EDIT_TRIP),
            },
          ],
    [trip?.archive, modalButtonHandler, common]
  );

  const breadcrumbs = useMemo(
    () => [
      { href: "/", label: tripTranslate("trip.item_one") },
      {
        href: `/trip/${id}`,
        label: trip?.name ?? tripTranslate("trip.item_other"),
      },
    ],
    [trip?.name, tripTranslate]
  );

  return (
    <Page buttons={buttons} mainButton={mainButton} breadcrumbs={breadcrumbs}>
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
