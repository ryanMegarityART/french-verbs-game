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

export const Conjugate = () => {
  const [guess, setGuess] = useState<any>("");
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [verb, setVerb] = useState<ConjugationVerb>(avoirExample);
  const [showAnswers, setShowAnswers] = useState(true);

  const updateGuess = (updateObj: any) => {
    setGuess({ ...guess, ...updateObj });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    setSubmitDisabled(true);

    console.log(guess);

    // check correct answers

    // if (guess.toLowerCase().trim() === translation.toLowerCase().trim()) {
    //   setShowSuccessAlert(true);
    //   postAttempt({ verb, correct: true, username: user.username });
    //   triggerReset();
    //   setScore((score) => score + 1);
    // } else {
    //   setShowErrorAlert(true);
    //   postAttempt({ verb, correct: false, username: user.username });
    //   triggerReset();
    //   setScore((score) => score - 1);
    // }

    setSubmitDisabled(false);
  };
  return (
    <div className="conj">
      <h2 className="m-3">🤔 Conjugate Game</h2>
      <Form className="p-3" onSubmit={onSubmit}>
        <h2>{verb.infinitive}</h2>
        <Form.Group className="mb-3">
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
                        value={guess.key}
                        autoComplete="off"
                      />
                    </Col>
                    <Col style={{ textAlign: "start" }}>{showAnswers && <p className="mt-2">✅</p>}</Col>
                  </Row>
                );
              })}
            <Button
              className="mt-3"
              variant="primary"
              type="submit"
              disabled={submitDisabled}
            >
              Submit
            </Button>
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
