import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorPage } from "./components/ErrorPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SignIn } from "./components/auth/SignIn";
import { Leaderboard } from "./components/Leaderboard";
import { MyStats } from "./components/MyStats";
import { Register } from "./components/auth/Register";
import { Root } from "./Root";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "play",
        element: <App />,
      },
      {
        path: "leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "my-stats",
        element: <MyStats />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
