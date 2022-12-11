import React from "react";
import Alert from "react-bootstrap/Alert";

interface ErrorAlertProps {
  errorMessage: string;
}

export const ErrorAlert = ({ errorMessage }: ErrorAlertProps) => {
  return (
    <div>
      <Alert variant="danger">{ errorMessage }</Alert>
    </div>
  );
};
