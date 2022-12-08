import React, { useEffect, useState } from "react";
import { DisplayTranslation } from "./DisplayTranslation";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ENDPOINT = "http://localhost:4000";

interface VerbResponse {
  verb: string;
  translation: string;
}

export const GuessVerb = () => {
  const [verb, setVerb] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");

  const getVerbAndTranslation = async () => {
    const resp = await fetch(ENDPOINT + "/verb");
    const respJSON: VerbResponse = await resp.json();

    setVerb(respJSON.verb);
    setTranslation(respJSON.translation);
  };

  useEffect(() => {
    getVerbAndTranslation();
  }, []);

  return (
    <div>
      {verb && translation && (
        <div className="guess">
          <h2>{verb}</h2>
          <DisplayTranslation translation={translation} />
          <Form>
            <Form.Group className="mb-3" controlId="formBasicGuess">
              <Form.Label>Enter Guess</Form.Label>
              <Form.Control type="text" placeholder="_ _ _ _" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};
