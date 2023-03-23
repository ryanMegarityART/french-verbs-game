import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import Container from "react-bootstrap/Container";
import frenchFlag from "../assets/french-flag.svg";
import { NavDropdown } from "react-bootstrap";

export const AppNavigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand={false}>
      <Container>
        <Navbar.Brand>
          <img src={frenchFlag} className="logo" alt="french flag" />
          francais-GPT
        </Navbar.Brand>
        <Navbar.Toggle
          className="toggle"
          aria-controls={`offcanvasNavbar-expand`}
        />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand`}
          aria-labelledby={`offcanvasNavbarLabel-expand`}
          placement="end"
        >
          <Offcanvas.Header closeButton />
          <Offcanvas.Body>
            <div>
              <div style={{ fontSize: "1.5em" }} className="mb-1">
                Chat 🤖
              </div>
              <div className="m-2 mb-3">
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href={`/chat`}>Start 💥</Nav.Link>
                </Nav>
              </div>
            </div>
            <hr />
            <div>
              <div style={{ fontSize: "1.5em" }} className="mb-1">
                Games 🕹️
              </div>
              <div className="m-2">
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <NavDropdown title="Play / Restart " id="basic-nav-dropdown">
                    <NavDropdown.Item href={`/play/translate`}>
                      🔡 Translate
                    </NavDropdown.Item>
                    <NavDropdown.Item href={`/play/conjugate`}>
                      ✍️ Conjugate
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href={`/leaderboard`}>Leaderboard 🏆</Nav.Link>
                </Nav>
              </div>
            </div>
            <hr />
            <div style={{ fontSize: "1.5em" }} className="mb-1">
              Account 👩‍💼
            </div>
            <div className="m-2">
              <Nav.Link
                style={{ color: "red" }}
                className="mt-3"
                onClick={() => {
                  localStorage.removeItem("user");
                }}
                href={`/`}
              >
                Sign Out 👋
              </Nav.Link>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};
