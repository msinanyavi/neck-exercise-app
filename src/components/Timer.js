// This file manages the timer functionality for the exercises, allowing users to start and stop the timer.

import React, { useState, useEffect } from 'react';

const Timer = ({ duration, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let timer = null;

        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            onComplete();
        }

        return () => clearInterval(timer);
    }, [isActive, timeLeft, onComplete]);

    const startTimer = () => {
        setIsActive(true);
    };

    const stopTimer = () => {
        setIsActive(false);
    };

    const resetTimer = () => {
        setTimeLeft(duration);
        setIsActive(false);
    };

    return (
        <div>
            <h2>{timeLeft} seconds left</h2>
            <button onClick={startTimer} disabled={isActive}>Start</button>
            <button onClick={stopTimer} disabled={!isActive}>Stop</button>
            <button onClick={resetTimer}>Reset</button>
        </div>
    );
};

export default Timer;