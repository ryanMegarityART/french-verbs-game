import { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { useOutletContext, useLocation } from "react-router-dom";

function App() {
  // @ts-ignore
  const [user, setUser] = useOutletContext();
  const location = useLocation();

  return (
    <div>
      <div className="app">
        <div>
          {location.pathname === "/play" && (
            <Container style={{ fontSize: "2em" }}>
              <h2 className="m-3">Select Game: </h2>
              <Row className="m-3">
                <Col>
                  <Card>
                    <Card.Body>
                      <a href={`/play/translate`}>
                        <span style={{ fontSize: "4em" }}>🔡</span>
                        <h4>Translate </h4>
                      </a>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="m-3">
                <Col>
                  <Card>
                    <Card.Body>
                      <a href={`/play/conjugate`}>
                        <span style={{ fontSize: "4em" }}>✍️</span>
                        <h4>Conjugate </h4>
                      </a>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          )}
          <Outlet context={[user, setUser]} />
        </div>
      </div>
    </div>
  );
}

export default App;
