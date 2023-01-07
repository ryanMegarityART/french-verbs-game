import React, { FormEvent, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

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

const avoirExample: ConjugationVerb = {
  infinitive: "avoir",
  tense: "Présent",
  conjugations: {
    "j'": "ai",
    tu: "as",
    "il / elle / on": "a",
    nous: "avons",
    vous: "avez",
    "ils / elles": "ont",
  },
};

interface ConjugationAnswer {
  "j'": boolean;
  tu: boolean;
  "il / elle / on": boolean;
  nous: boolean;
  vous: boolean;
  "ils / elles": boolean;
}

const BLANK_GUESS = {
  "j'": "",
  tu: "",
  "il / elle / on": "",
  nous: "",
  vous: "",
  "ils / elles": "",
};

export const Conjugate = () => {
  const [guess, setGuess] = useState<any>("");
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [verb, setVerb] = useState<ConjugationVerb>(avoirExample);
  const [answerObj, setAnswerObj] = useState<any>();
  const [currentVerbAttempts, setCurrentVerbAttempts] = useState(0);
  const updateGuess = (updateObj: any) => {
    setGuess({ ...guess, ...updateObj });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    setSubmitDisabled(true);

    // check correct answers
    setAnswerObj(
      Object.fromEntries(
        Object.entries(verb.conjugations).map(([key, value]) => {
          console.log(guess);
          console.log(key, guess[key], value, guess[key] === value);
          return [[key], guess[key] === value];
        })
      )
    );

    setCurrentVerbAttempts((currentVerbAttempts) => currentVerbAttempts + 1);

    if (currentVerbAttempts > 2) {
      setGuess(verb.conjugations);
      setTimeout(() => {
        setVerb(avoirExample);
        setAnswerObj(undefined);
        setGuess(BLANK_GUESS);
        setCurrentVerbAttempts(0);
      }, 2500);
    }

    setSubmitDisabled(false);
  };
  return (
    <div className="conj">
      <h2 className="mb-3">✍️ Conjugate Game</h2>
      <Form className="p-1" onSubmit={onSubmit}>
        <h1 className="m-3 p-1">{verb.infinitive}</h1>
        <Form.Group className="mb-3" controlId="conjugationForm">
          <Form.Label className="m-3" style={{ fontSize: "0.7em" }}>
            Enter <strong>Présent</strong> Tense Conjugations:
          </Form.Label>
          <div>
            {verb &&
              verb.conjugations &&
              Object.entries(verb.conjugations).map(([key, value]) => {
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
