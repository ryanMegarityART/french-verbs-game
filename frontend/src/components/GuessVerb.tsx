import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { SuccessAlert } from "./shared/SuccessAlert";
import { ErrorAlert } from "./shared/ErrorAlert";
import { useNavigate, useOutletContext } from "react-router-dom";
import { checkAuthenticationResponse } from "../helpers/token";

interface VerbResponse {
  verb: string;
  translation: string;
}

interface Attempt {
  verb: string;
  correct: boolean;
  username: string;
}

export interface GuessVerbProps {
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
}

export const GuessVerb = ({ score, setScore }: GuessVerbProps) => {
  const navigate = useNavigate();
  // @ts-ignore
  const [user, setUser] = useOutletContext();

  const [verb, setVerb] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [guess, setGuess] = useState<string>("");
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);

  const getVerbAndTranslation = async () => {
    if (user) {
      const resp = await fetch(import.meta.env.VITE_ENDPOINT + "/verb", {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
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
      const respJSON: VerbResponse = await resp.json();

      setVerb(respJSON.verb);
      setTranslation(respJSON.translation);
    }
  };

  const transationHintString = (translation: string) => {
    const translationWordsArray = translation.split(" ");
    let transationHintString = "";
    translationWordsArray.map((translationWord, i) => {
      transationHintString =
        transationHintString +
        translationWord[0].toString() +
        "_ ".repeat(translationWord.length - 1);
      if (i < translationWordsArray.length - 1) {
        transationHintString + " ";
      }
    });
    return (
      transationHintString +
      `(${translation.length - translationWordsArray.length + 1})`
    );
  };

  const postAttempt = async (attempt: Attempt) => {
    if (user) {
      const response = await fetch(import.meta.env.VITE_ENDPOINT + "/attempt", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          Authentication: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(attempt), // body data type must match "Content-Type" header
      });

      if (!response.ok) {
        return await checkAuthenticationResponse(
          response,
          setUser,
          setError,
          navigate
        );
      }
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("verb: ", verb, "answer: ", translation, "guess: ", guess);
    if (guess.toLowerCase() === translation.toLowerCase()) {
      setShowSuccessAlert(true);
      postAttempt({ verb, correct: true, username: user.username });
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2000);
      setScore(score + 1);
      getVerbAndTranslation();
      setGuess("");
    } else {
      setShowErrorAlert(true);
      postAttempt({ verb, correct: false, username: user.username });
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 2000);
      setScore(score - 1);
      getVerbAndTranslation();
      setGuess("");
    }
  };

  useEffect(() => {
    if (user) {
      getVerbAndTranslation();
    }
  }, [user]);

  return (
    <div>
      {error && <ErrorAlert errorMessage={error} />}
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
        {showErrorAlert && <ErrorAlert errorMessage="Incorrect 😟" />}
      </div>
    </div>
  );
};
