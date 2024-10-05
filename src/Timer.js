import React, { useState, useEffect, useRef } from "react";
import sound from "./assets/alarm.mp3";

export default function Timer() {
  const [timer, setTimer] = useState("25:00");
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [chosenMode, setChosenMode] = useState("pomodoro");
  // Store the remaining time in milliseconds
  const [timeRemaining, setTimeRemaining] = useState(25 * 60 * 1000);
  // Reference to store the interval ID so we can clear it later
  const intervalRef = useRef(null);

  // Function to set the time based on the mode selected (Pomodoro, short break, long break)
  const setTimeNumber = (button) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPaused(false);
    setIsStarted(false);
    setChosenMode(button);
    let newTimeInMinutes = 25; // Default to Pomodoro time
    // For background animation
    let newClass = "";
    // document.getElementById("app").classList = "App";
    document.body.classList = "";
    if (button === "pomodoro") {
      newTimeInMinutes = 25;
      newClass = "pomodoroBackground";
    } else if (button === "short") {
      newTimeInMinutes = 5;
      newClass = "shortBreakBackground";
    } else if (button === "long") {
      newTimeInMinutes = 15;
      newClass = "longBreakBackground";
    }
    // document.getElementById("app").classList.add(newClass);
    document.body.classList.add(newClass);

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
      `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`
    );
  };
  const playAudio = () => {
    const alarmAudio = new Audio(sound);
    alarmAudio.play();

    setTimeout(() => {
      alarmAudio.pause(); // Stop the audio
      alarmAudio.currentTime = 0; // Reset the audio to the beginning
    }, 3000); // Stop after 3 seconds
  };
  // Function to start the timer
  const startTimer = () => {
    const startTime = Date.now(); // Get current time in milliseconds
    const deadline = startTime + timeRemaining; // Calculate the end time

    // Create a new interval that ticks every second
    intervalRef.current = setInterval(() => {
      // new Audio(alarm).play();
      const now = Date.now();
      const remaining = Math.max(0, deadline - now);

      setTimeRemaining(remaining);
      updateDisplay(remaining);

      // If time is up, stop the interval and reset the start state
      if (remaining === 0) {
        clearInterval(intervalRef.current);
        setIsStarted(false);
        playAudio();
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
        <button
          className={chosenMode === "pomodoro" ? "activeButton" : ""}
          onClick={() => setTimeNumber("pomodoro")}
        >
          Pomodoro
        </button>
        <button
          className={chosenMode === "short" ? "activeButton" : ""}
          onClick={() => setTimeNumber("short")}
        >
          Short Break
        </button>
        <button
          className={chosenMode === "long" ? "activeButton" : ""}
          onClick={() => setTimeNumber("long")}
        >
          Long Break
        </button>
      </div>

      {/* Display the current timer */}
      <p id="timeDisplay">{timer}</p>

      {/* Start/Pause/Resume button */}
      <button
        className={`${isStarted && !isPaused ? "buttonPressed" : ""} ${
          chosenMode === "pomodoro"
            ? "pomodoroText"
            : chosenMode === "short"
            ? "shortBreakText"
            : "longBreakText"
        }`}
        id="manageTimer"
        onClick={handleTimerToggle}
      >
        {isStarted && !isPaused ? "PAUSE" : "START"}
      </button>
    </div>
  );
}
