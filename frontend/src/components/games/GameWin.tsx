import React, { FC } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface GameWinProps {
  handleClose: () => void;
}

export const GameWin: FC<GameWinProps> = ({ handleClose }) => {
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
        <Modal.Title>Game Won! 🎉</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>You accumulated 20 points, well done!</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Play again
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
