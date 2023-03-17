import React, { FC } from "react";
import Alert from "react-bootstrap/Alert";

interface ErrorAlertProps {
  errorMessage: string;
}

export const ErrorAlert: FC<ErrorAlertProps> = ({ errorMessage }) => {
  return (
    <div>
      <Alert variant="danger">{errorMessage}</Alert>
    </div>
  );
};
