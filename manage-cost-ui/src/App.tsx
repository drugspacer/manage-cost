import React, { lazy, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Trips from "./pages/Trips";
import Login from "./pages/Login";
import { AuthContext } from "./context/Auth";
import withLazyLoading from "./components/HOC/withLazyLoading";
const Profile = lazy(() => import("./pages/Profile"));
const Register = lazy(() => import("./pages/Register"));
const Trip = lazy(() => import("./pages/Trip"));

const PageNotFound = () => <h1>Page Not Found</h1>;

function App() {
  const { user } = useContext(AuthContext);
  console.log("App render");

  return user ? (
    <Routes>
      <Route path="/" element={<Navigate replace to="/trips" />} />
      <Route path="/login" element={<Navigate replace to="/trips" />} />
      <Route path="/register" element={<Navigate replace to="/trips" />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/trip/:id" element={withLazyLoading(Trip)} />
      <Route path="/profile" element={withLazyLoading(Profile)} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={withLazyLoading(Register)} />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
