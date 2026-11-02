import { useEffect, useState } from "react";

const ONE_SECOND_IN_MS = 1000;

export function useElapsedSeconds() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => setElapsedSeconds((current) => current + 1),
      ONE_SECOND_IN_MS,
    );
    return () => clearInterval(intervalId);
  }, []);

  return elapsedSeconds;
}
