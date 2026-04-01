import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const GAME_DURATION = 30; // seconds
const BUG_LIFETIME = 1000; // ms
const MIN_SPAWN = 500; // ms
const MAX_SPAWN = 1000; // ms
const BUG_SIZE = 40; // px

function getRandomPosition() {
  const x = Math.random() * (window.innerWidth - BUG_SIZE - 20) + 10;
  const y = Math.random() * (window.innerHeight - BUG_SIZE - 100) + 60;
  return { x, y };
}

export default function App() {
  const [gameState, setGameState] = useState("ready"); // ready | running | over
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [bugs, setBugs] = useState([]);
  const bugId = useRef(0);
  const timerRef = useRef();
  const spawnRef = useRef();

  // Timer effect
  useEffect(() => {
    if (gameState !== "running") return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setGameState("over");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Bug spawn effect
  useEffect(() => {
    if (gameState !== "running") return;
    let spawnTimeout;
    function spawnBug() {
      setBugs((bugs) => [
        ...bugs,
        {
          id: bugId.current++,
          ...getRandomPosition(),
        },
      ]);
      const nextSpawn = Math.random() * (MAX_SPAWN - MIN_SPAWN) + MIN_SPAWN;
      spawnTimeout = setTimeout(spawnBug, nextSpawn);
    }
    spawnBug();
    return () => clearTimeout(spawnTimeout);
  }, [gameState]);

  // Bug lifetime effect
  useEffect(() => {
    if (!bugs.length) return;
    const timers = bugs.map((bug) =>
      setTimeout(() => {
        setBugs((bugs) => bugs.filter((b) => b.id !== bug.id));
      }, BUG_LIFETIME)
    );
    return () => timers.forEach(clearTimeout);
  }, [bugs]);

  function startGame() {
    setScore(0);
    setTimer(GAME_DURATION);
    setBugs([]);
    setGameState("running");
    bugId.current = 0;
  }

  function handleBugClick(id) {
    setScore((s) => s + 1);
    setBugs((bugs) => bugs.filter((b) => b.id !== id));
  }

  return (
    <div className="container">
      <h1>🐞 BugHunter</h1>
      <div className="hud">
        <span>Score: {score}</span>
        <span>Time: {timer}s</span>
      </div>
      {gameState === "ready" && (
        <button className="start-btn" onClick={startGame}>
          Start
        </button>
      )}
      {gameState === "running" && (
        <div className="game-area">
          {bugs.map((bug) => (
            <div
              key={bug.id}
              className="bug"
              style={{ left: bug.x, top: bug.y, width: BUG_SIZE, height: BUG_SIZE }}
              onClick={() => handleBugClick(bug.id)}
            >
              🐞
            </div>
          ))}
        </div>
      )}
      {gameState === "over" && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your score: {score}</p>
          <button className="start-btn" onClick={startGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
