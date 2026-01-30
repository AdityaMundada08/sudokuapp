import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function SudokuGame({ puzzleData, onBack }) {
  const [grid, setGrid] = useState([]);
  const [originalPuzzle, setOriginalPuzzle] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [message, setMessage] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (puzzleData) {
      const puzzleCopy = puzzleData.puzzle.map(row => [...row]);
      setGrid(puzzleCopy);
      setOriginalPuzzle(puzzleData.puzzle);
    }
  }, [puzzleData]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCellClick = (row, col) => {
    if (originalPuzzle[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (num) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (originalPuzzle[row][col] === 0) {
        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = num;
        setGrid(newGrid);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (selectedCell && e.key >= '0' && e.key <= '9') {
      handleNumberInput(parseInt(e.key));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  const handleSubmit = async () => {
    setVerifying(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API_URL}/verify/`, {
        puzzle_id: puzzleData.puzzleId,
        grid: grid
      });

      setMessage({
        type: response.data.correct ? 'success' : 'error',
        text: response.data.message
      });

      if (response.data.correct) {
        setIsRunning(false);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to verify solution. Please try again.'
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleClear = () => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (originalPuzzle[row][col] === 0) {
        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = 0;
        setGrid(newGrid);
      }
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="game-info">
          <span className="difficulty-badge">{puzzleData.difficulty}</span>
          <span className="timer">⏱ {formatTime(timer)}</span>
        </div>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="sudoku-board">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => {
              const isOriginal = originalPuzzle[rowIndex][colIndex] !== 0;
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
              const boxClass = `cell ${isOriginal ? 'original' : 'editable'} ${isSelected ? 'selected' : ''}`;
              
              return (
                <div
                  key={colIndex}
                  className={boxClass}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            className="number-btn"
            onClick={() => handleNumberInput(num)}
            disabled={!selectedCell}
          >
            {num}
          </button>
        ))}
        <button
          className="number-btn clear-btn"
          onClick={handleClear}
          disabled={!selectedCell}
        >
          Clear
        </button>
      </div>

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={verifying}
      >
        {verifying ? 'Verifying...' : 'Submit Solution'}
      </button>
    </div>
  );
}

export default SudokuGame;