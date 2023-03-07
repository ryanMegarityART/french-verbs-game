import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import frenchFlag from "../../assets/french-flag.svg";
import { ErrorAlert } from "../shared/ErrorAlert";
import { User } from "../../Root";

export const SignIn = () => {
  const [user, setUser] = useOutletContext<[User, React.Dispatch<React.SetStateAction<User | undefined>>]>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/play", { replace: true });
    }
  }, [user]);

  const signIn = useCallback(
    async (isGuest: boolean = false) => {
      const response = await fetch(import.meta.env.VITE_ENDPOINT + "/login", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: isGuest
          ? JSON.stringify({ email: "guest", password: "" })
          : JSON.stringify({
              email,
              password,
            }),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        console.log("errorMessage: ", errorMessage);
        return setError(errorMessage);
      }
      const userResp = await response.json();
      setUser(userResp);
      localStorage.setItem("user", JSON.stringify(userResp));
      navigate("/play");
    },
    [email, password]
  );

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn();
  };

  const handleGuest = () => {
    signIn(true);
  };

  return (
    <div className="vertical-center">
      <h1 style={{ width: "90vw", marginBottom: "3em" }}>
        <img src={frenchFlag} className="logo" alt="french flag" />
        French Verbs Game
      </h1>
      <div className="m-3"></div>
      {error && <ErrorAlert errorMessage={error} />}
      <Form className="mt-3" onSubmit={handleLogin}>
        <Form.Group className="m-3" controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e: any) => {
              setEmail(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="m-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: any) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
      <div className="mt-3">
        <p>
          <span>
            Don't have an account?{" "}
            <a style={{ color: "blue", cursor: "pointer" }} href="/register">
              register here
            </a>
          </span>
        </p>
      </div>
      <div className="mt-3 p-3">
        <p>
          <span>
            Play as a guest?{" "}
            <Button
              variant="info"
              type="button"
              onClick={handleGuest}
              style={{ color: "white" }}
            >
              Try Me!
            </Button>
          </span>
        </p>
      </div>
    </div>
  );
};
