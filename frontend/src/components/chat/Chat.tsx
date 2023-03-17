import { CreateChatCompletionResponse } from "openai";
import React, { CSSProperties, FC, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import TypewriterComponent from "typewriter-effect";
import { checkAuthenticationResponse } from "../../helpers/token";
import { User } from "../../Root";
import FadeLoader from "react-spinners/FadeLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export const Chat: FC = () => {
  const [stringsToType, setStringsToType] = useState<string[]>([]);
  const [typedStrings, setTypedStrings] = useState<string[]>([]);
  const [chatPrompt, setChatPrompt] = useState(
    "Hello! Can you assist me with learning french? (please respond to prompts in french)"
  );
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("#0066ff");

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
    if (user && chatPrompt) {
      console.log("user exists");
      const resp = await fetch(
        import.meta.env.VITE_ENDPOINT + "/chat" + `?chatPrompt=${chatPrompt}`,
        {
          method: "GET",
          headers: {
            Authentication: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!resp.ok) {
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
    }
    console.log("ended");
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
        {stringsToType.map((string, i) => {
          return (
            <TypewriterComponent
              // onInit={(typewriter) => {
              //   typewriter
              //     .changeDelay(75)
              //     .typeString(string)
              //     .pauseFor(2500)
              //     .callFunction(() => {
              //       setStringsToType([]);
              //     })
              //     .start();
              // }}

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
          <Row>
            <Col md={10}>
              <Form.Control
                type="text"
                placeholder=""
                required={true}
                className="conjugation-text-box"
                onChange={(e) => setChatPrompt(e.target.value)}
                value={chatPrompt}
                autoComplete="off"
              />
            </Col>
            <Col>
              <Button
                onClick={(e) => {
                  e.preventDefault;
                  getChat();
                }}
              >
                ➡️
              </Button>
            </Col>
          </Row>
        )}
      </div>
    </Container>
  );
};
