import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorPage } from "./components/ErrorPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SignIn } from "./components/auth/SignIn";
import { Leaderboard } from "./components/Leaderboard";
import { Register } from "./components/auth/Register";
import { Root } from "./Root";
import { GuessVerb } from "./components/GuessVerb";
import "./App.css";
import { Conjugate } from "./components/Conjugate";
import { AddConjugationVerb } from "./components/AddConjugationVerb";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "play",
        element: <App />,
        children: [
          {
            path: "translate",
            element: <GuessVerb />,
          },
          {
            path: "conjugate",
            element: <Conjugate />,
          },
          {
            path: "add-conjugation-verb",
            element: <AddConjugationVerb />,
          },
        ],
      },
      {
        path: "leaderboard",
        element: <Leaderboard />,
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
