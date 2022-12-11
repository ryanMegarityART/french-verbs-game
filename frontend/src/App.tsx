import { useState } from "react";
import { GuessVerb } from "./components/GuessVerb";
import { Score } from "./components/Score";
import { GameOver } from "./components/GameOver";
import { GameWin } from "./components/GameWin";

function App() {
  const [score, setScore] = useState(10);

  const handleGameReset = () => {
    setScore(10);
  };

  return (
    <div>
      <div className="app">
        <div className="card">
          {score > 0 && score < 20 && (
            <GuessVerb score={score} setScore={setScore} />
          )}
          {score <= 0 && <GameOver handleClose={handleGameReset} />}
          {score >= 20 && <GameWin handleClose={handleGameReset} />}
        </div>
        <Score score={score} />
      </div>
    </div>
  );
}

export default App;
