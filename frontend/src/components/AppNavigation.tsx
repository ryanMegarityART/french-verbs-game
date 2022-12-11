import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import Container from "react-bootstrap/Container";
import frenchFlag from "../assets/french-flag.svg";

export const AppNavigation = () => {

  return (
    <Navbar expand={false}>
      <Container>
        <Navbar.Brand>
          <img src={frenchFlag} className="logo" alt="french flag" /> French
          Verbs Game
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand`}
          aria-labelledby={`offcanvasNavbarLabel-expand`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand`}>
              Options
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href={`/play`}>Play / Restart ▶️</Nav.Link>
              <Nav.Link href={`/leaderboard`}>Leaderboard 🏆</Nav.Link>
              <Nav.Link
                style={{ color: "red" }}
                onClick={() => {
                  localStorage.removeItem("user");
                }}
                href={`/`}
              >
                Sign Out 👋
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};
