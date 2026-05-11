import { useState, useEffect } from 'react';
import { initialGames } from '../data/games';

const GAMES_KEY = 'bgc_games';
const RATINGS_KEY = 'bgc_ratings';

export function useGames() {
  const [games, setGames] = useState(() => {
    try {
      const stored = localStorage.getItem(GAMES_KEY);
      return stored ? JSON.parse(stored) : initialGames;
    } catch {
      return initialGames;
    }
  });

  const [ratings, setRatingsState] = useState(() => {
    try {
      const stored = localStorage.getItem(RATINGS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(GAMES_KEY, JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  }, [ratings]);

  const updateGame = (id, fields) => {
    setGames(prev => prev.map(g => g.id === id ? { ...g, ...fields } : g));
  };

  // Set both p1 and p2 ratings for a game atomically
  const setGameRatings = (gameId, { p1, p2 }) => {
    setRatingsState(prev => ({
      ...prev,
      [gameId]: { p1, p2 },
    }));
  };

  const getRating = (gameId) => {
    return ratings[gameId] || { p1: null, p2: null };
  };

  const getAverage = (gameId) => {
    const r = getRating(gameId);
    const vals = [r.p1, r.p2].filter(v => v !== null && v !== undefined);
    if (vals.length === 0) return null;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
  };

  return { games, ratings, updateGame, setGameRatings, getRating, getAverage };
}
