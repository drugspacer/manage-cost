import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Trips from "./pages/Trips";
import Trip from "./pages/Trip";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthContext } from "./context/Auth";
import Profile from "./pages/Profile";

const PageNotFound = () => <h1>Page Not Found</h1>;

function App() {
  const { user, isLoading } = useContext(AuthContext);

  return isLoading ? null : user ? (
    <Routes>
      <Route path="/" element={<Navigate replace to="/trips" />} />
      <Route path="/login" element={<Navigate replace to="/trips" />} />
      <Route path="/register" element={<Navigate replace to="/trips" />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/trip/:id" element={<Trip />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
