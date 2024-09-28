import React, { useState, useEffect, useRef } from "react";

export default function Timer() {
  const [timer, setTimer] = useState("00:25:00");
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  // Store the remaining time in milliseconds
  const [timeRemaining, setTimeRemaining] = useState(25 * 60 * 1000);
  // Reference to store the interval ID so we can clear it later
  const intervalRef = useRef(null);

  // Function to set the time based on the mode selected (Pomodoro, short break, long break)
  const setTimeNumber = (button) => {
    let newTimeInMinutes = 25; // Default to Pomodoro time
    if (button === "pomodoro") newTimeInMinutes = 25;
    else if (button === "short") newTimeInMinutes = 5;
    else if (button === "long") newTimeInMinutes = 15;

    // Update the remaining time in milliseconds
    setTimeRemaining(newTimeInMinutes * 60 * 1000);

    // Update the displayed time immediately after mode switch
    updateDisplay(newTimeInMinutes * 60 * 1000);
  };

  // Function to update the displayed timer string (MM:SS format)
  const updateDisplay = (remainingMs) => {
    const totalSeconds = Math.floor(remainingMs / 1000); // Convert ms to seconds
    const minutes = Math.floor(totalSeconds / 60); // Get full minutes
    const seconds = totalSeconds % 60; // Get remaining seconds
    setTimer(
      `00:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`
    );
  };

  // Function to start the timer
  const startTimer = () => {
    const startTime = Date.now(); // Get current time in milliseconds
    const deadline = startTime + timeRemaining; // Calculate the end time

    // Create a new interval that ticks every second
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, deadline - now);

      setTimeRemaining(remaining);
      updateDisplay(remaining);

      // If time is up, stop the interval and reset the start state
      if (remaining === 0) {
        clearInterval(intervalRef.current);
        setIsStarted(false);
      }
    }, 1000);
  };

  // Function to initialize and start the timer
  const initialiseTimer = () => {
    setIsStarted(true);
    startTimer();
  };

  // Function to pause the timer
  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current); // Stop the interval
    setIsPaused(true);
  };

  // Function to resume the timer from a paused state
  const resumeTimer = () => {
    setIsPaused(false);
    startTimer();
  };

  // Function to toggle between starting, pausing, and resuming the timer
  const handleTimerToggle = () => {
    if (!isStarted) initialiseTimer(); // Start if not started
    else if (isPaused) resumeTimer(); // Resume if paused
    else pauseTimer(); // Pause if running
  };

  useEffect(() => {
    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="timer">
      {/* Buttons to switch between different timer modes */}
      <div className="timerModesSwitches">
        <button onClick={() => setTimeNumber("pomodoro")}>Pomodoro</button>
        <button onClick={() => setTimeNumber("short")}>Short Break</button>
        <button onClick={() => setTimeNumber("long")}>Long Break</button>
      </div>

      {/* Display the current timer */}
      <p>{timer}</p>

      {/* Start/Pause/Resume button */}
      <button onClick={handleTimerToggle}>
        {isStarted && !isPaused ? "Pause" : "Start"}
      </button>
    </div>
  );
}
