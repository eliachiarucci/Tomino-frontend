import React, { useEffect, useState } from "react";

interface props {
  time: number;
  tickRate?: number;
  running?: boolean;
  onTick?: Function;
  onFinish?: Function;
  name?: string | number;
}

const Timer = ({ time, tickRate = 1000, running = true, onTick, onFinish, name }: props) => {
  const [timer, setTimer] = useState<number>(time);
  const [intervalState, setIntervalState] = useState<any>();

  useEffect(() => {
    clearInterval(intervalState);
    setIntervalState(
      setInterval(() => {
        if (running) {
          setTimer((oldTimer) => oldTimer - 1);
        }
      }, tickRate)
    );
    console.log(running);
  }, [running]);

  useEffect(() => {
    if (timer < 1) {
      clearInterval(intervalState);
      if (onFinish) onFinish();
    }

    if (onTick) onTick(timer, name);
  }, [timer]);

  return <div>{timer}</div>;
};

export default Timer;
