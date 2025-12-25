import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./css/home.css";

export default function Home() {
  const navigate = useNavigate();

  /* ===============================
     SPEECH (VOICE COUNTDOWN)
  ================================ */
  const speak = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // stop previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  /* ===============================
     WORKOUT STATE
  ================================ */
  const [workouts, setWorkouts] = useState([
    { id: 1, name: "Full Body Workout", minutes: 20 },
  ]);
  const [selectedWorkout, setSelectedWorkout] = useState(workouts[0]);

  /* ===============================
     ADD WORKOUT FORM
  ================================ */
  const [newWorkout, setNewWorkout] = useState("");
  const [newTime, setNewTime] = useState(10);

  /* ===============================
     TIMER STATE
  ================================ */
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    selectedWorkout.minutes * 60
  );

  /* ===============================
     RESET TIMER WHEN WORKOUT CHANGES
  ================================ */
  useEffect(() => {
    setIsRunning(false);
    setTimeLeft(selectedWorkout.minutes * 60);
  }, [selectedWorkout]);

  /* ===============================
     TIMER + VOICE COUNTDOWN
  ================================ */
  useEffect(() => {
    if (!isRunning) return;

    // 🔊 Countdown voice
    if (timeLeft === 3) speak("Three");
    if (timeLeft === 2) speak("Two");
    if (timeLeft === 1) speak("One");

    // 🔔 Finish voice
    if (timeLeft === 0) {
      setIsRunning(false);
      speak("Workout complete");
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  /* ===============================
     FORMAT TIME
  ================================ */
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  /* ===============================
     ADD WORKOUT
  ================================ */
  const addWorkout = () => {
    if (!newWorkout || newTime <= 0) return;

    const workout = {
      id: Date.now(),
      name: newWorkout,
      minutes: newTime,
    };

    setWorkouts((prev) => [...prev, workout]);
    setSelectedWorkout(workout);
    setNewWorkout("");
    setNewTime(10);
  };

  /* ===============================
     CIRCULAR PROGRESS
  ================================ */
  const TOTAL_SECONDS = selectedWorkout.minutes * 60;
  const CIRCUMFERENCE = 440;
  const progressOffset =
    CIRCUMFERENCE -
    (CIRCUMFERENCE * timeLeft) / TOTAL_SECONDS;

  return (
    <div className="home">
      {/* ================= HEADER ================= */}
      <header className="home-header">
        <h1 className="title">🏠 Home Workout</h1>
        <p className="subtitle">
          Choose workout · Set time · Train
        </p>
      </header>

      {/* ================= MAIN ================= */}
      <main className="home-main">
        {/* TIMER CARD */}
        <section className="timer-card">
          <h2>{selectedWorkout.name}</h2>

          {/* CIRCULAR TIMER */}
          <div className="progress-wrapper">
            <svg className="progress-ring" width="160" height="160">
              <circle
                className="progress-ring__bg"
                cx="80"
                cy="80"
                r="70"
              />
              <circle
                className="progress-ring__progress"
                cx="80"
                cy="80"
                r="70"
                style={{ strokeDashoffset: progressOffset }}
              />
            </svg>

            <div className="progress-time">
              {minutes}:{seconds}
            </div>
          </div>

          {/* CONTROLS */}
          <div className="timer-controls">
            <button
              className="btn primary"
              onClick={() => {
                speak("Workout started");
                setIsRunning((p) => !p);
              }}
            >
              {isRunning ? "⏸ Pause" : "▶ Start"}
            </button>

            <button
              className="btn secondary"
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(selectedWorkout.minutes * 60);
                speak("Reset");
              }}
            >
              🔁 Reset
            </button>
          </div>
        </section>

        {/* ADD WORKOUT */}
        <section className="add-workout">
          <h3>Add Workout</h3>

          <input
            type="text"
            placeholder="Workout name"
            value={newWorkout}
            onChange={(e) => setNewWorkout(e.target.value)}
          />

          <input
            type="number"
            min="1"
            placeholder="Minutes"
            value={newTime}
            onChange={(e) => setNewTime(Number(e.target.value))}
          />

          <button className="btn primary full" onClick={addWorkout}>
            ➕ Add Workout
          </button>
        </section>

        {/* WORKOUT LIST */}
        <section className="workout-list">
          <h3>Your Workouts</h3>

          {workouts.map((w) => (
            <div
              key={w.id}
              className={`workout-item ${
                selectedWorkout.id === w.id ? "active" : ""
              }`}
              onClick={() => setSelectedWorkout(w)}
            >
              <span>{w.name}</span>
              <span>{w.minutes} min</span>
            </div>
          ))}
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <button
          className="next-page-btn"
          onClick={() => navigate("/workouts")}
        >
          →
        </button>
      </footer>
    </div>
  );
}
