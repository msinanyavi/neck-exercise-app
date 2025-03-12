import React from 'react';

const ExerciseCard = ({ exercise, onStart, onStop, isActive }) => {
    return (
        <div className="exercise-card">
            <h2>{exercise.name}</h2>
            <img src={exercise.gif} alt={exercise.name} />
            <p>Duration: {exercise.duration} seconds</p>
            <div className="controls">
                <button onClick={onStart} disabled={isActive}>Start</button>
                <button onClick={onStop} disabled={!isActive}>Stop</button>
            </div>
        </div>
    );
};

export default ExerciseCard;