import React, { FormEvent, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { checkAuthenticationResponse } from "../helpers/token";
import { ErrorAlert } from "./shared/ErrorAlert";
import { postAttempt } from "./shared/postAttempt";
import { SuccessAlert } from "./shared/SuccessAlert";

interface ConjugationVerb {
  infinitive: string;
  tense: string;
  conjugations: Conjugations;
}

interface Conjugations {
  "j'": string;
  tu: string;
  "il / elle / on": string;
  nous: string;
  vous: string;
  "ils / elles": string;
}

interface ConjugationAnswer {
  "j'": boolean;
  tu: boolean;
  "il / elle / on": boolean;
  nous: boolean;
  vous: boolean;
  "ils / elles": boolean;
}

export const BLANK_GUESS = {
  "j'": "",
  tu: "",
  "il / elle / on": "",
  nous: "",
  vous: "",
  "ils / elles": "",
};

export const Conjugate = () => {
  const navigate = useNavigate();
  // @ts-ignore
  const [user, setUser] = useOutletContext();
  const [guess, setGuess] = useState<any>("");
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [verb, setVerb] = useState<ConjugationVerb>();
  const [answerObj, setAnswerObj] = useState<any>();
  const [currentVerbAttempts, setCurrentVerbAttempts] = useState(0);
  const [error, setError] = useState<string>("");
  const updateGuess = (updateObj: any) => {
    setGuess({ ...guess, ...updateObj });
  };
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    setSubmitDisabled(true);

    if (verb) {
      setSubmitDisabled(true);

      // check correct answers
      const answerObj = Object.fromEntries(
        Object.entries(verb.conjugations).map(([key, value]) => {
          return [[key], guess[key] === value];
        })
      );
      setAnswerObj(answerObj);
      const allCorrect = Object.values(answerObj).reduce(
        (prev, curr) => prev && curr,
        true
      );
      if (allCorrect) {
        setShowSuccessAlert(true);
        postAttempt(
          { verb: verb.infinitive, correct: true, username: user.username },
          user,
          setUser,
          setError,
          navigate
        );
        setTimeout(() => {
          setShowSuccessAlert(false);
          getVerbWithConjugation();
          setAnswerObj(undefined);
          setGuess(BLANK_GUESS);
          setCurrentVerbAttempts(0);
        }, 1500);
      } else {
        setCurrentVerbAttempts(
          (currentVerbAttempts) => currentVerbAttempts + 1
        );

        if (currentVerbAttempts > 2) {
          setGuess(verb.conjugations);
          setTimeout(() => {
            getVerbWithConjugation();
            setAnswerObj(undefined);
            setGuess(BLANK_GUESS);
            setCurrentVerbAttempts(0);
          }, 2500);
        }
      }

      setSubmitDisabled(false);
    }
  };

  const getVerbWithConjugation = async () => {
    if (user) {
      setSubmitDisabled(true);
      setLoading(true);
      const resp = await fetch(import.meta.env.VITE_ENDPOINT + "/conjugate", {
        method: "GET",
        headers: {
          Authentication: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        return await checkAuthenticationResponse(
          resp,
          setUser,
          setError,
          navigate
        );
      }
      const respJSON: { randomVerb: ConjugationVerb[] } = await resp.json();

      setVerb(respJSON.randomVerb[0]);
      setSubmitDisabled(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    getVerbWithConjugation();
  }, [user]);

  return (
    <div className="conj">
      <h2 className="mb-3">✍️ Conjugate Game</h2>
      {showSuccessAlert && <SuccessAlert />}
      {error && <ErrorAlert errorMessage={error} />}
      {verb && verb.conjugations && (
        <Form className="p-1" onSubmit={onSubmit}>
          <h1 className="m-3 p-1">{verb.infinitive}</h1>
          <Form.Group className="mb-3" controlId="conjugationForm">
            <Form.Label className="m-3" style={{ fontSize: "0.7em" }}>
              Enter <strong>{verb.tense}</strong> Tense Conjugations:
            </Form.Label>
            <div>
              {Object.entries(verb.conjugations).map(([key, value]) => {
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
                          updateGuess({
                            [key]: e.target.value.toLowerCase(),
                          })
                        }
                        value={guess[key]}
                        autoComplete="off"
                      />
                    </Col>
                    <Col style={{ textAlign: "start" }}>
                      {answerObj && !!answerObj[key] && (
                        <p className="mt-2">✅</p>
                      )}
                      {answerObj && !answerObj[key] && (
                        <p className="mt-2">❌</p>
                      )}
                    </Col>
                  </Row>
                );
              })}

              {currentVerbAttempts === 0 && (
                <Button
                  className="mt-3"
                  variant="primary"
                  type="submit"
                  disabled={submitDisabled}
                >
                  Submit
                </Button>
              )}

              {currentVerbAttempts > 0 && currentVerbAttempts < 3 && (
                <Button
                  className="mt-3"
                  variant="warning"
                  type="submit"
                  disabled={submitDisabled}
                >
                  Try Again
                </Button>
              )}

              {currentVerbAttempts > 2 && (
                <Button
                  className="mt-3"
                  variant="danger"
                  type="submit"
                  disabled={submitDisabled}
                >
                  Show Answers
                </Button>
              )}
            </div>
          </Form.Group>
        </Form>
      )}
      <div className="add-link" style={{ fontSize: "0.7em" }}>
        <Card bg="info" text="white" style={{ width: "100%" }} className="mb-2">
          {/* <Card.Header>Header</Card.Header> */}
          <Card.Body>
            <Card.Title>✍️ Want more verbs?</Card.Title>
            <Card.Text>
              You can add new verbs with conjugations{" "}
              <a href={`add-conjugation-verb`}>here</a>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};
