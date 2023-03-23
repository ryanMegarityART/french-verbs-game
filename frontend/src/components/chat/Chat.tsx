import React, { CSSProperties, FC, useCallback, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { User } from "../../Root";
import FadeLoader from "react-spinners/FadeLoader";
import AudioRecord from "./AudioRecord";
import { ErrorAlert } from "../shared/ErrorAlert";
import { fetchChat } from "./chatService";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export const Chat: FC = () => {
  const [typedStrings, setTypedStrings] = useState<string[]>([
    "Je suis prêt à vous aider. Comment puis-je vous aider à apprendre le français?",
  ]);
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

  const getChat = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError("");
    let promptBody = typedStrings;
    if (audioBlob) {
      try {
        const audioRespJSON: any = await fetchChat(
          "/chat/audio/transcribe",
          "POST",
          audioBlob,
          user.token,
          setUser,
          setError,
          navigate
        );
        console.log(audioRespJSON);
        // setTypedStrings((t) => [...t, audioRespJSON.text]);
        promptBody.push(audioRespJSON.text);
      } catch (e: any) {
        console.log(e);
        setChatPrompt("");
        setAudioBlob("");
        setError(e.message);
        return;
      }
    } else if (chatPrompt) {
      console.log("here");
      // setTypedStrings((x) => [...x, chatPrompt]);
      promptBody.push(chatPrompt);
    }

    const chatRespJSON: any = await fetchChat(
      "/chat/prompt",
      "POST",
      promptBody,
      user.token,
      setUser,
      setError,
      navigate
    );
    console.log(chatRespJSON.choices[0].message.content!);
    setTypedStrings((t) => {
      console.log(t);
      return [...t, chatRespJSON.choices[0].message.content!];
    });
    setChatPrompt("");
    setAudioBlob("");
    setError("");
    setLoading(false);
  }, [user, chatPrompt, audioBlob, typedStrings, setUser, navigate]);

  if (!user) {
    return <></>;
  }

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
