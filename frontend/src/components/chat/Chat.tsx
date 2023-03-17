import { CreateChatCompletionResponse } from "openai";
import React, { CSSProperties, FC, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import TypewriterComponent from "typewriter-effect";
import { checkAuthenticationResponse } from "../../helpers/token";
import { User } from "../../Root";
import FadeLoader from "react-spinners/FadeLoader";
import AudioRecord from "./AudioRecord";
import { ErrorAlert } from "../shared/ErrorAlert";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

interface PromptBody {
  type: "text" | "audio";
  prompt: string;
}

export const Chat: FC = () => {
  const [stringsToType, setStringsToType] = useState<string[]>([]);
  const [typedStrings, setTypedStrings] = useState<string[]>([]);
  const [chatPrompt, setChatPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#0066ff");
  const [audioBlob, setAudioBlob] = useState(""); //base-64
  //   setTimeout(() => {
  //     setStringsToType((x) => [...x, "hi"]);
  //   }, 2000);

  const [user, setUser] =
    useOutletContext<
      [User, React.Dispatch<React.SetStateAction<User | undefined>>]
    >();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const getChat = async () => {
    console.log("triggered");
    setLoading(true);
    if (user && (chatPrompt || audioBlob)) {
      console.log("user exists");
      const body: PromptBody = {
        type: chatPrompt ? "text" : "audio",
        prompt: chatPrompt ? chatPrompt : audioBlob,
      };
      const resp = await fetch(import.meta.env.VITE_ENDPOINT + "/chat/prompt", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authentication: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        setLoading(false);
        return await checkAuthenticationResponse(
          resp,
          setUser,
          setError,
          navigate
        );
      }
      const respJSON: any = await resp.json();
      console.log(respJSON, respJSON.choices[0].message.content);
      setTypedStrings((x) => [...x, chatPrompt]);
      setStringsToType([respJSON.choices[0].message.content!]);
      setChatPrompt("");
      setAudioBlob("");
    }
    console.log("ended");
    setError("");
    setLoading(false);
  };

  useEffect(() => {
    getChat();
  }, []);

  return (
    <Container>
      <h2>parlez avec moi 🤖</h2>
      {typedStrings.map((string, i) => {
        return (
          <p key={`${string}_${i}`} style={{ fontWeight: "1.5em" }}>
            {string}
          </p>
        );
      })}
      <div className="mb-3" style={{ fontFamily: "monospace" }}>
        <FadeLoader
          color={color}
          loading={loading}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        {error && <ErrorAlert errorMessage={error} />}
        {stringsToType.map((string, i) => {
          return (
            <TypewriterComponent
              options={{
                strings: [string],
                autoStart: true,
                delay: 75,
                loop: false,
                onRemoveNode: () => {
                  setStringsToType([]);
                  setTypedStrings((t) => [...typedStrings, string]);
                },
              }}
              key={`${string}_${i}`}
            />
          );
        })}
      </div>
      <div className="mt-3">
        {!loading && (
          <Row style={{ marginTop: "5em" }}>
            <Col md={6}>
              <AudioRecord blob={audioBlob} setBlob={setAudioBlob} />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="what would you like to ask?"
                required={true}
                className="conjugation-text-box"
                onChange={(e) => setChatPrompt(e.target.value)}
                value={chatPrompt}
                autoComplete="off"
              />
            </Col>
            <Col md={2}>
              <Button
                onClick={(e) => {
                  e.preventDefault;
                  getChat();
                }}
                disabled={!audioBlob && !chatPrompt}
              >
                Submit
              </Button>
            </Col>
          </Row>
        )}
      </div>
    </Container>
  );
};
