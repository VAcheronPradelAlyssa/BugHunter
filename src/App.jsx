import { useState, useEffect, useRef } from "react";
import "./App.css";

const GAME_DURATION = 30;
const BUG_SIZE = 40;

const LEVELS = {
  facile: {
    spawnRate: 800,
    lifetime: 1500,
    maxBugs: 5,
  },
  difficile: {
    spawnRate: 500,
    lifetime: 1200,
    quickLifetime: 700,
    maxBugs: 7,
  },
};

function getRandomPosition() {
  return {
    x: Math.random() * (600 - BUG_SIZE),
    y: Math.random() * (350 - BUG_SIZE),
  };
}

export default function App() {
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [bugs, setBugs] = useState([]);
  const [level, setLevel] = useState("facile");

  const bugId = useRef(0);

  // 🎯 TIMER
  useEffect(() => {
    if (gameState !== "running") return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setGameState("over");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // 🐞 SPAWN BUGS
  useEffect(() => {
    if (gameState !== "running") return;

    const interval = setInterval(() => {
      setBugs((prev) => {
        if (prev.length >= LEVELS[level].maxBugs) return prev;

        const isQuick =
          level === "difficile" && Math.random() < 0.4;

        return [
          ...prev,
          {
            id: bugId.current++,
            ...getRandomPosition(),
            quick: isQuick,
          },
        ];
      });
    }, LEVELS[level].spawnRate);

    return () => clearInterval(interval);
  }, [gameState, level]);

  // ⏳ DISPARITION BUGS
  useEffect(() => {
    if (gameState !== "running") return;

    const timeouts = bugs.map((bug) => {
      const lifetime =
        level === "difficile" && bug.quick
          ? LEVELS[level].quickLifetime
          : LEVELS[level].lifetime;

      return setTimeout(() => {
        setBugs((current) =>
          current.filter((b) => b.id !== bug.id)
        );
      }, lifetime);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [bugs, level, gameState]);

  // ▶️ START
  function startGame() {
    setScore(0);
    setTimer(GAME_DURATION);
    setBugs([]);
    bugId.current = 0;
    setGameState("running");
  }

  // 🎯 CLICK BUG
  function handleBugClick(bug) {
    setBugs((prev) => prev.filter((b) => b.id !== bug.id));

    if (level === "difficile" && bug.quick) {
      setScore((s) => s + 2); // 🔴 rapide = 2 points
    } else {
      setScore((s) => s + 1); // 🟡 normal = 1 point
    }
  }

  return (
    <div className="container">
      <h1>🐞 BugHunter</h1>

      <div className="hud">
        <span>Score: {score}</span>
        <span>Time: {timer}s</span>
      </div>

      {gameState === "ready" && (
        <>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="facile">Facile</option>
            <option value="difficile">Difficile</option>
          </select>

          <button onClick={startGame}>Start</button>
        </>
      )}

      {gameState === "running" && (
        <div className="game-area">
          {bugs.map((bug) => (
            <div
              key={bug.id}
              className={`bug ${bug.quick ? "bug-fast" : "bug-normal"}`}
              style={{
                left: bug.x,
                top: bug.y,
                width: BUG_SIZE,
                height: BUG_SIZE,
              }}
              onClick={() => handleBugClick(bug)}
            >
              🐞
            </div>
          ))}
        </div>
      )}

      {gameState === "over" && (
        <div className="game-over">
          <h2>Game Over</h2>
          <p>Score: {score}</p>
          <button onClick={startGame}>Rejouer</button>
        </div>
      )}
    </div>
  );
}