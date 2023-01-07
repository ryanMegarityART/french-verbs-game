import React, { FormEvent, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

interface ConjugationVerb {
  infinitive: string;
  tense: string;
  conjugations: {
    pre: string;
    conjugation: string;
  }[];
}

const avoirExample: ConjugationVerb = {
  infinitive: "avoir",
  tense: "Présent",
  conjugations: [
    {
      pre: "j'",
      conjugation: "ai",
    },
    {
      pre: "tu",
      conjugation: "as",
    },
    {
      pre: "il / elle / on",
      conjugation: "a",
    },
    {
      pre: "nous",
      conjugation: "avons",
    },
    {
      pre: "vous",
      conjugation: "avez",
    },
    {
      pre: "ils / elles",
      conjugation: "ont",
    },
  ],
};

export const Conjugate = () => {
  const [guess, setGuess] = useState<any>("");
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [verb, setVerb] = useState<ConjugationVerb>(avoirExample);

  const updateGuess = (updateObj: any) => {
    setGuess({ ...guess, ...updateObj });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    setSubmitDisabled(true);

    console.log(guess);

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
          <Form.Label className="m-3">
            Enter <strong>Présent</strong> Tense Conjugations:
          </Form.Label>
          <Container>
            {verb &&
              verb.conjugations &&
              verb.conjugations.length &&
              verb.conjugations.map((conj) => {
                return (
                  <Row key={conj.pre} style={{ fontSize: "0.9em" }}>
                    <Col style={{ textAlign: "end" }}>
                      <p>{conj.pre}</p>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder=""
                        required={true}
                        className="conjugation-text-box"
                        onChange={(e) =>
                          updateGuess({ [conj.pre]: e.target.value.toLowerCase() })
                        }
                        value={guess[`${conj.pre}`]}
                        id={`${conj.pre}_answer`}
                        autoComplete="off"
                      />
                    </Col>
                  </Row>
                );
              })}
          </Container>
        </Form.Group>
        {!showErrorAlert && !showSuccessAlert && (
          <Button variant="primary" type="submit" disabled={submitDisabled}>
            Submit
          </Button>
        )}
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
