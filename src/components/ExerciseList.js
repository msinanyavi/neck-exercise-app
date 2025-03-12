import exercises from '../data/exercises';

const ExerciseList = () => {
    return (
        <div>
            {exercises.map((exercise, index) => (
                <div key={index}>
                    <h2>{exercise.name}</h2>
                    <img src={exercise.gif} alt={exercise.name} />
                    <p>Duration/Sets: {exercise.duration}</p>
                </div>
            ))}
        </div>
    );
};

export default ExerciseList;