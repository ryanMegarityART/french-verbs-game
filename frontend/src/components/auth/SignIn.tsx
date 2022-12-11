import React, { FormEvent, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import frenchFlag from "../../assets/french-flag.svg";
import { ErrorAlert } from "../shared/ErrorAlert";

export const SignIn = () => {
  // @ts-ignore
  const [user, setUser] = useOutletContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  let navigate = useNavigate();


  useEffect(() => {
    if (user) {
      navigate("/play", { replace: true });
    }
  }, [user]);

  const signIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(import.meta.env.VITE_ENDPOINT + "/login", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({
        email,
        password,
      }), // body data type must match "Content-Type" header
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
  };

  return (
    <div className="vertical-center">
      <div className="m-3">
        <h1>
          <img src={frenchFlag} className="logo" alt="french flag" /> French
          Verbs Game
        </h1>
      </div>
      {error && <ErrorAlert errorMessage={error} />}
      <Form className="mt-3" onSubmit={signIn}>
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
    </div>
  );
};
