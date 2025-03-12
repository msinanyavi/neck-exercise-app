import React, { useState } from 'react';
import ExerciseCard from './ExerciseCard';
import Navigation from './Navigation';
import exercises from '../data/exercises';
import './App.css';

const App = () => {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const handleStartStop = () => {
        setIsTimerRunning(!isTimerRunning);
    };

    const handleNextExercise = () => {
        setCurrentExerciseIndex((prevIndex) => (prevIndex + 1) % exercises.length);
        setIsTimerRunning(false);
    };

    return (
        <div className="app">
            <h1>Neck Exercise App</h1>
            <ExerciseCard 
                exercise={exercises[currentExerciseIndex]} 
                isTimerRunning={isTimerRunning} 
                onStartStop={handleStartStop} 
            />
            <Navigation 
                onNext={handleNextExercise} 
                isTimerRunning={isTimerRunning} 
            />
        </div>
    );
};

export default App;