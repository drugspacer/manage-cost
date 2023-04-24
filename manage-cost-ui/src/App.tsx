import React, { lazy, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/Auth";
import withLazyLoading from "./components/HOC/withLazyLoading";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

// Load the 'common' namespace before rendering MyComponent
i18n.loadNamespaces("common");

const Profile = lazy(() =>
  import("./pages/Profile").then((module) => {
    // Load the 'profile' namespace when the module is loaded
    return i18n.loadNamespaces("profile").then(() => module);
  })
);

const Login = lazy(() =>
  import("./pages/Login").then((module) => {
    // Load the 'auth' namespace when the module is loaded
    return i18n.loadNamespaces("auth").then(() => module);
  })
);

const Register = lazy(() => import("./pages/Register"));

const Trips = lazy(() =>
  import("./pages/Trips").then((module) => {
    // Load the 'trip' namespace when the module is loaded
    return i18n.loadNamespaces("trip").then(() => module);
  })
);

const About = lazy(() =>
  import("./pages/About").then((module) => {
    // Load the 'trip' namespace when the module is loaded
    return Promise.all([
      i18n.loadNamespaces("about"),
      i18n.loadNamespaces("trip"),
    ]).then(() => module);
  })
);

const Trip = lazy(() => import("./pages/Trip"));

const PageNotFound = () => {
  const { t } = useTranslation();
  return <h1>{t("error.notFound")}</h1>;
};

function App() {
  const { user } = useContext(AuthContext);

  const content = user
    ? [
        <Route key="/" path="/" element={<Navigate replace to="/trips" />} />,
        <Route
          key="index"
          path="/index.html"
          element={<Navigate replace to="/trips" />}
        />,
        <Route
          key="login"
          path="/login"
          element={<Navigate replace to="/trips" />}
        />,
        <Route
          key="register"
          path="/register"
          element={<Navigate replace to="/trips" />}
        />,
        <Route key="trips" path="/trips" element={withLazyLoading(Trips)} />,
        <Route key="trip" path="/trip/:id" element={withLazyLoading(Trip)} />,
        <Route
          key="profile"
          path="/profile"
          element={withLazyLoading(Profile)}
        />,
        <Route key="*" path="*" element={<PageNotFound />} />,
      ]
    : [
        <Route key="login" path="/login" element={withLazyLoading(Login)} />,
        <Route
          key="register"
          path="/register"
          element={withLazyLoading(Register)}
        />,
        <Route key="*" path="*" element={<Navigate replace to="/login" />} />,
      ];
  content.unshift(
    <Route key="about" path="/about" element={withLazyLoading(About)} />
  );

  return <Routes>{content}</Routes>;
}

export default App;
