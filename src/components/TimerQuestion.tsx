import { useCallback, useEffect, useRef, useState } from "react";
import { QuizQuestionReady } from "../types/types";
import timerDisplay from "../util/timerDisplay";

export const TimerQuestion = ({ time: initialTime, endGame }: { time: QuizQuestionReady['questionTime'], endGame: () => void }) => {
    const [time, setTime] = useState(initialTime);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const stopAndResetTimer = useCallback(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTime(initialTime); // Reset time to initial value
    }, [initialTime]);

    useEffect(() => {
    // Start the timer only if it's not already running and time is greater than 0
    if (time > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    }

    // Cleanup function to stop the timer when the component unmounts
    return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [time]);

  useEffect(() => {
    // Stop and reset the timer when time runs out
    if (time === 0) {
      endGame();
    }
  }, [time, endGame]);

  return (
    <>
      {time > 0 && <button 
        className="rounded-full border-sky-700 border-[10px] text-3xl font-extrabold text-sky-700 w-32 h-32 place-self-center" 
        onClick={() => {
          stopAndResetTimer();
        }}>
          {timerDisplay(time)}
      </button>}
    </>
  );
};

export default TimerQuestion;
