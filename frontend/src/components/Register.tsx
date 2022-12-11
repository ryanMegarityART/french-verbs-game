import React, { FormEvent, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import frenchFlag from "../assets/french-flag.svg";
import { ErrorAlert } from "./ErrorAlert";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useOutletContext();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(import.meta.env.VITE_ENDPOINT + "/register", {
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
        username,
      }), // body data type must match "Content-Type" header
    });
    if (!response.ok) {
      setError(await response.text());
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
      <Form className="mt-3" onSubmit={register}>
        <Form.Group className="m-3" controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e: any) => {
              setEmail(e.target.value);
            }}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="m-3" controlId="formBasicUsername">
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e: any) => {
              setUsername(e.target.value);
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
          Register
        </Button>
      </Form>
      <div className="mt-3">
        <p>
          <span>
            Already have an account?{" "}
            <a style={{ color: "blue", cursor: "pointer" }} href="/sign-in">
              sign in here
            </a>
          </span>
        </p>
      </div>
    </div>
  );
};
