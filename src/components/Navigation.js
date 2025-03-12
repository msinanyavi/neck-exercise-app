import React from 'react';

const Navigation = ({ currentExercise, totalExercises, onNext, onStartStop }) => {
    return (
        <div className="navigation">
            <button onClick={onStartStop}>
                {currentExercise.isActive ? 'Stop' : 'Start'}
            </button>
            <button onClick={onNext} disabled={currentExercise.index >= totalExercises - 1}>
                Next
            </button>
        </div>
    );
};

export default Navigation;