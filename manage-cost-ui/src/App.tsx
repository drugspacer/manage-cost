import React from "react";
import { Route, Routes } from "react-router-dom";
import Trips from "./pages/Trips";
import Trip from "./pages/Trip";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Trips />} />
      <Route path="/trip/:id" element={<Trip />} />
    </Routes>
  );
}

export default App;
