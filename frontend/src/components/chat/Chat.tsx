import { CreateChatCompletionResponse } from "openai";
import React, { CSSProperties, FC, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
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
  const [stringsToType, setStringsToType] = useState<string[]>([
    "Je suis prêt à vous aider. Comment puis-je vous aider à apprendre le français?",
  ]);
  const [typedStrings, setTypedStrings] = useState<string[]>([]);
  const [chatPrompt, setChatPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#0066ff");
  const [audioBlob, setAudioBlob] = useState(""); //base-64

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
    <Container className="p-3">
      {/* <h2>parlez avec moi 🤖</h2> */}
      {typedStrings.map((string, i) => {
        return (
          <Card
            key={`${string}_${i}`}
            style={{
              marginLeft: i % 2 !== 0 ? "25vw" : 0,
              marginRight: i % 2 !== 0 ? "0" : "25vw",
              backgroundColor:
                i % 2 !== 0 ? "rgba(0, 255, 0, 0.2)" : "rgba(0, 0, 255, 0.2)",
              marginBottom: "2em",
            }}
          >
            <Card.Body style={{ fontWeight: "1.5em" }}>{string}</Card.Body>
          </Card>
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
              <Form.Control
                type="text"
                placeholder="type or record a question..."
                required={true}
                className="conjugation-text-box"
                onChange={(e) => setChatPrompt(e.target.value)}
                value={chatPrompt}
                autoComplete="off"
              />
            </Col>
            <Col md={4}>
              <AudioRecord blob={audioBlob} setBlob={setAudioBlob} />
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
