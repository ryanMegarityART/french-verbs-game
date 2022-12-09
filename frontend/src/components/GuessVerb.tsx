import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { DisplayTranslation } from "./DisplayTranslation";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { SuccessAlert } from "./SuccessAlert";
import { ErrorAlert } from "./ErrorAlert";

const ENDPOINT = "http://localhost:4000";

interface VerbResponse {
  verb: string;
  translation: string;
}

export interface GuessVerbProps {
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
}

export const GuessVerb = ({ score, setScore }: GuessVerbProps) => {
  const [verb, setVerb] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");

  const [guess, setGuess] = useState<string>("");

  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);

  const getVerbAndTranslation = async () => {
    const resp = await fetch(ENDPOINT + "/verb");
    const respJSON: VerbResponse = await resp.json();

    setVerb(respJSON.verb);
    setTranslation(respJSON.translation);
  };

  const transationHintString = (translation: string) => {
    const translationWordsArray = translation.split(" ");
    let transationHintString = "";
    translationWordsArray.map((translationWord, i) => {
      transationHintString =
        transationHintString +
        translation[0].toString() +
        "_ ".repeat(translation.length - 1);
      if (i < translationWordsArray.length - 1) {
        transationHintString + " ";
      }
    });
    return (
      transationHintString +
      `(${translation.length - translationWordsArray.length})`
    );
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("answer: ", translation, "guess: ", guess);
    if (guess === translation) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 1500);
      setScore(score + 1);
      getVerbAndTranslation();
      setGuess("");
    } else {
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 1500);
      setScore(score - 1);
    }
  };

  useEffect(() => {
    getVerbAndTranslation();
  }, []);

  return (
    <div>
      {verb && translation && (
        <div className="guess mt-3">
          <h2>{verb}</h2>
          {/* <DisplayTranslation translation={translation} /> */}
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="formBasicGuess">
              <Form.Label className="mt-3">
                Enter English Translation:
              </Form.Label>
              <Form.Control
                type="text"
                placeholder={transationHintString(translation)}
                onChange={(e) => setGuess(e.target.value)}
                value={guess}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      )}
      <div className="mt-3" style={{ minHeight: "5em" }}>
        {showSuccessAlert && <SuccessAlert />}
        {showErrorAlert && <ErrorAlert />}
      </div>
    </div>
  );
};
