import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { useOutletContext, useLocation } from "react-router-dom";

function App() {
  // @ts-ignore
  const [user, setUser] = useOutletContext();
  const location = useLocation();

  return (
    <div>
      <div className="app">
        <div className="card">
          {location.pathname === "/play" && (
            <Container>
              <h2 className="m-3">Select Game: </h2>
              <Row className="m-3">
                <Col>
                  <a href={`/play/translate`}>
                    <h4>🔡 Translate </h4>
                  </a>
                </Col>
              </Row>
              <Row className="m-3">
                <Col>
                  <a href={`/play/conjugate`}>
                    <h4>🤔 Conjugate </h4>
                  </a>
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
