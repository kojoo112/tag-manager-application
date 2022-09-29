import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

const TopNavbar = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>XCAPE</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">X-KIT</Nav.Link>
            <Nav.Link href="/hint-manager">Hint</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default TopNavbar;
