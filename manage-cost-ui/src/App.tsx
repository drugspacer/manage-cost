import React from "react";
import { Route, Routes } from "react-router-dom";
import Trips from "./pages/Trips";
import Trip from "./pages/Trip";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Trips />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/trip/:id" element={<Trip />} />
    </Routes>
  );
}

export default App;
