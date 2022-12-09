import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

export interface ScoreProps {
  score: number;
}

export const Score = ({ score }: ScoreProps) => {
  return (
    <div className="mt-3">
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
      <h4>Score: {score}</h4>
    </div>
  );
};
