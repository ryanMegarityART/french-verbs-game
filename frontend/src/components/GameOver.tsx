import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const GameOver = ({ handleClose }: any) => {
  return (
    <Modal
      show={true}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleClose}
      animation={true}
    >
      <Modal.Header>
        <Modal.Title>Game Over! 💀</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>You ran out of points.</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Play again
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
