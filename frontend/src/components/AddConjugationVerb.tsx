import React, { Component, CSSProperties, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { checkAuthenticationResponse } from "../helpers/token";
import WS from "react-windowed-select";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BLANK_GUESS } from "./Conjugate";
import { ErrorAlert } from "./shared/ErrorAlert";
import FadeLoader from "react-spinners/FadeLoader";
import { SuccessAlert } from "./shared/SuccessAlert";

const WindowedSelect = (WS as any).default ? (WS as any).default : WS;

export const AddConjugationVerb = () => {
  const navigate = useNavigate();
  // @ts-ignore
  const [user, setUser] = useOutletContext();
  const [verbOptions, setVerbOptions] = useState();
  const [tenseOptions, setTenseOptions] = useState();
  const [selectedVerb, setSelectedVerb] = useState<any>();
  const [selectedTense, setSelectedTense] = useState<any>();
  const [conjugations, setConjugations] = useState<any>(BLANK_GUESS);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#0066ff");

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const updateConjugation = (updateObj: any) => {
    setConjugations({ ...conjugations, ...updateObj });
  };

  const getFormOptions = async () => {
    const resp = await fetch(
      import.meta.env.VITE_ENDPOINT + "/conjugate/add-options",
      {
        method: "GET",
        headers: {
          Authentication: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!resp.ok) {
      return await checkAuthenticationResponse(
        resp,
        setUser,
        setError,
        navigate
      );
    }
    const respJSON = await resp.json();

    setVerbOptions(
      respJSON.verbs.map((verb: any) => {
        return {
          label: verb.verb,
          value: verb.id,
        };
      })
    );

    setTenseOptions(
      respJSON.tenses.map((tense: any) => {
        return {
          label: tense.tense,
          value: tense.id,
        };
      })
    );
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitDisabled(true);
    setLoading(true);
    const postObject = {
      verbId: selectedVerb.value,
      tenseId: selectedTense.value,
      conjugations,
    };
    console.log(postObject);
    if (user) {
      const response = await fetch(
        import.meta.env.VITE_ENDPOINT + "/conjugate/add",
        {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          headers: {
            Authentication: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(postObject),
        }
      );

      if (!response.ok) {
        setLoading(false);
        setSubmitDisabled(false);
        return await checkAuthenticationResponse(
          response,
          setUser,
          setError,
          navigate
        );
      }
    }
    setShowSuccessAlert(true);
    setLoading(false);
    setSubmitDisabled(false);
  };

  useEffect(() => {
    if (user) {
      getFormOptions();
    }
  }, [user]);

  return (
    <div>
      <a
        style={{ position: "fixed", left: "2em", marginBottom: "5em" }}
        href="/play/conjugate"
      >
        👈 conjugate game
      </a>
      <br></br>
      <h1 className="m-3">Add Verb Conjugation</h1>
      {showSuccessAlert && <SuccessAlert />}
      {error && <ErrorAlert errorMessage={error} />}{" "}
      <FadeLoader
        color={color}
        loading={loading}
        cssOverride={override}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <Container className="p-3">
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="verbSelect">
            <WindowedSelect
              options={verbOptions}
              windowThreshold={0}
              placeholder="Select Verb..."
              value={selectedVerb}
              onChange={setSelectedVerb}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="tenseSelect">
            <WindowedSelect
              options={tenseOptions}
              windowThreshold={0}
              placeholder="Select Tense..."
              value={selectedTense}
              onChange={setSelectedTense}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="conjugationForm">
            <Form.Label className="m-3" style={{ fontSize: "1em" }}>
              Enter Conjugations:
            </Form.Label>
            <div>
              {Object.entries(BLANK_GUESS).map(([key, value]) => {
                return (
                  <Row
                    key={key}
                    style={{ fontSize: "0.7em" }}
                    className="justify-content-md-center mt-2"
                  >
                    <Col style={{ textAlign: "end" }} xs={4}>
                      <p className="mt-2">{key}</p>
                    </Col>
                    <Col xs={6}>
                      <Form.Control
                        type="text"
                        placeholder=""
                        required={true}
                        className="conjugation-text-box"
                        onChange={(e) =>
                          updateConjugation({
                            [key]: e.target.value.toLowerCase(),
                          })
                        }
                        value={conjugations[key]}
                        autoComplete="off"
                      />
                    </Col>
                  </Row>
                );
              })}
            </div>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={submitDisabled}>
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
};
