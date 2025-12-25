import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('rayofit_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeWorkout, setActiveWorkout] = useState(null);

  // Save to local storage whenever history changes
  useEffect(() => {
    localStorage.setItem('rayofit_history', JSON.stringify(history));
  }, [history]);

  const addSet = (exerciseName, weight, reps) => {
    const newSet = {
      id: Date.now(),
      exercise: exerciseName,
      weight: parseFloat(weight),
      reps: parseInt(reps),
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => [newSet, ...prev]);
  };

  const getVolumeData = () => {
    // Logic to calculate total weight lifted per day for the chart
    return history.slice(0, 7).map(set => set.weight * set.reps);
  };

  return (
    <WorkoutContext.Provider value={{ history, addSet, getVolumeData }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);