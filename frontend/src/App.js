import React, { useState } from 'react';
import Home from './components/Home';
import SudokuGame from './components/SudokuGame';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [puzzleData, setPuzzleData] = useState(null);

  const handleStartGame = (data) => {
    setPuzzleData(data);
    setCurrentView('game');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setPuzzleData(null);
  };

  return (
    <div className="App">
      {currentView === 'home' ? (
        <Home onStartGame={handleStartGame} />
      ) : (
        <SudokuGame 
          puzzleData={puzzleData} 
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;