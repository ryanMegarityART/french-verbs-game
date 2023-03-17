import React, { FC } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

export interface ScoreProps {
  score: number;
}

export const Score: FC<ScoreProps> = ({ score }) => {
  return (
    <div className="m-3">
      <ProgressBar>
        <ProgressBar
          striped
          variant={score < 5 ? "danger" : score < 15 ? "warning" : "success"}
          now={(score / 20) * 100}
          key={1}
        />
        {/* <ProgressBar variant="warning" now={20} key={2} /> */}
        {/* <ProgressBar striped variant="danger" now={10} key={3} /> */}
      </ProgressBar>
      <h4 className="m-3">Score: {score}</h4>
    </div>
  );
};
