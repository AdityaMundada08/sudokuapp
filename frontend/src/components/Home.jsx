import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function Home({ onStartGame }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDifficultySelect = async (difficulty) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/generate/`, {
        difficulty: difficulty
      });

      onStartGame({
        puzzleId: response.data.puzzle_id,
        puzzle: response.data.puzzle,
        difficulty: response.data.difficulty
      });
    } catch (err) {
      setError('Failed to generate puzzle. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="title">Sudoku Game</h1>
        <p className="subtitle">Choose your difficulty level</p>

        {error && <div className="error-message">{error}</div>}

        <div className="difficulty-buttons">
          <button
            className="difficulty-btn easy"
            onClick={() => handleDifficultySelect('easy')}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Easy'}
          </button>
          <button
            className="difficulty-btn medium"
            onClick={() => handleDifficultySelect('medium')}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Medium'}
          </button>
          <button
            className="difficulty-btn hard"
            onClick={() => handleDifficultySelect('hard')}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Hard'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;