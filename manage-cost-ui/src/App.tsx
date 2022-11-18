import React from "react";
import "./App.css";
import AppBarHeader from "./components/Layout/AppBarHeader";
import ITrip from "./models/trip.model";
import Grid from "@mui/material/Grid";
import TripCard from "./components/TripCard";
import Container from "@mui/material/Container";

const DUMMY_TRIPS: ITrip[] = [{
  id: crypto.randomUUID(),
  place: 'Шерегеш',
  participants: ['Ксения', 'Павел', 'Колян', 'Настя', 'Сергей'],
  isArchive: true
}, {
  id: crypto.randomUUID(),
  place: 'Ярославль',
  participants: ['Ксения', 'Павел', 'Рамис', 'Настя', 'Сергей', 'Наташа', 'Катя'],
  isArchive: false
}, {
  id: crypto.randomUUID(),
  place: 'Ярославль',
  participants: ['Ксения', 'Павел', 'Рамис', 'Настя', 'Сергей', 'Наташа', 'Катя'],
  isArchive: false
}, {
  id: crypto.randomUUID(),
  place: 'Ярославль',
  participants: ['Ксения', 'Павел', 'Рамис', 'Настя', 'Сергей', 'Наташа', 'Катя'],
  isArchive: false
}, {
  id: crypto.randomUUID(),
  place: 'Ярославль',
  participants: ['Ксения', 'Павел', 'Рамис', 'Настя', 'Сергей', 'Наташа', 'Катя'],
  isArchive: false
}, {
  id: crypto.randomUUID(),
  place: 'Ярославль',
  participants: ['Ксения', 'Павел', 'Рамис', 'Настя', 'Сергей', 'Наташа', 'Катя'],
  isArchive: false
}, {
  id: crypto.randomUUID(),
  place: 'Ярославль',
  participants: ['Ксения', 'Павел', 'Рамис', 'Настя', 'Сергей', 'Наташа', 'Катя'],
  isArchive: false
}, {
  id: crypto.randomUUID(),
  place: 'Ярославль',
  participants: ['Ксения', 'Павел', 'Рамис', 'Настя', 'Сергей', 'Наташа', 'Катя'],
  isArchive: false
}, {
  id: crypto.randomUUID(),
  place: 'Ярославль',
  participants: ['Ксения', 'Павел', 'Рамис', 'Настя', 'Сергей', 'Наташа', 'Катя'],
  isArchive: false
}]

function App() {
  return (
    <>
      <AppBarHeader />
      <Container>
        <Grid container spacing={2}>
          {DUMMY_TRIPS.map(item => <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={item.id}><TripCard trip={item} /></Grid>)}
        </Grid>
      </Container>

    </>
  );
}

export default App;
