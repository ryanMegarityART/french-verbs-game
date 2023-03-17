import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { checkAuthenticationResponse } from "../../helpers/token";
import { User } from "../../Root";

interface Leaderboard {
  numberCorrect: number;
  username: string;
}

export const Leaderboard = () => {
  const [user, setUser] = useOutletContext<[User, React.Dispatch<React.SetStateAction<User | undefined>>]>();
  const [error, setError] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>();
  const navigate = useNavigate();

  const getLeaderboard = async () => {
    if (user) {
      const resp = await fetch(import.meta.env.VITE_ENDPOINT + "/leaderboard", {
        method: "GET",
        headers: {
          Authentication: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        return await checkAuthenticationResponse(
          resp,
          setUser,
          setError,
          navigate
        );
      }
      const respJSON: Leaderboard[] = await resp.json();

      setLeaderboard(respJSON);
    }
  };

  useEffect(() => {
    getLeaderboard();
  }, [user]);

  return (
    <div>
      <h2>Leaderboard 🏆</h2>
      <div>
        {leaderboard &&
          leaderboard.length &&
          leaderboard.map((leaderboardRow, i) => {
            return (
              <Card className="mt-3" key={leaderboardRow.username}>
                <Card.Header as="h5">
                  {i === 0
                    ? "🥇"
                    : i === 1
                    ? "🥈"
                    : i === 2
                    ? "🥉"
                    : `${i + 1}`}
                </Card.Header>
                <Card.Body>
                  <Card.Title>Username: {leaderboardRow.username}</Card.Title>
                  <Card.Text>{leaderboardRow.numberCorrect} correct answers</Card.Text>
                </Card.Body>
              </Card>
            );
          })}
      </div>
    </div>
  );
};
