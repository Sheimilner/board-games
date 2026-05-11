import { useState, useMemo } from 'react';
import GameCard from './GameCard';
import Filters from './Filters';
import GameEdit from './GameEdit';
import RatingModal from './RatingModal';

const DEFAULT_FILTERS = {
  search:    '',
  sortBy:    'nombre',
  tipo:      '',
  categoria: '',
  portable:  '',
  jugadores: '',
  tiempoMax: 180,
  edadMax:   18,
  bggMin:    0,
  propioMin: 0,
};

export default function GameList({ games, ratings, updateGame, setGameRatings, getRating, getAverage }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [editingGame, setEditingGame] = useState(null);
  const [ratingGame, setRatingGame]   = useState(null);

  const filtered = useMemo(() => {
    // Inline average helper to avoid stale closure issues
    const avg = (gameId) => {
      const r = ratings[gameId] || { p1: null, p2: null };
      const vals = [r.p1, r.p2].filter(v => v !== null && v !== undefined);
      if (vals.length === 0) return null;
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    };

    let result = [...games];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(g => g.nombre.toLowerCase().includes(q));
    }
    if (filters.tipo) {
      result = result.filter(g => g.tipo === filters.tipo);
    }
    if (filters.categoria) {
      result = result.filter(g => g.categoria === filters.categoria);
    }
    if (filters.portable !== '') {
      const p = filters.portable === 'true';
      result = result.filter(g => g.portable === p);
    }
    if (filters.jugadores !== '') {
      const n = parseInt(filters.jugadores, 10);
      if (!isNaN(n)) {
        result = result.filter(g => g.jugMin <= n && g.jugMax >= n);
      }
    }
    if (filters.tiempoMax < 180) {
      result = result.filter(g => g.tiempo <= filters.tiempoMax);
    }
    if (filters.edadMax < 18) {
      result = result.filter(g => g.edadMin <= filters.edadMax);
    }
    if (filters.bggMin > 0) {
      result = result.filter(g => g.bgg != null && g.bgg >= filters.bggMin);
    }
    if (filters.propioMin > 0) {
      result = result.filter(g => {
        const a = avg(g.id);
        return a !== null && a >= filters.propioMin;
      });
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre, 'es');
        case 'propio': {
          const aA = avg(a.id) ?? -1;
          const bA = avg(b.id) ?? -1;
          return bA !== aA ? bA - aA : a.nombre.localeCompare(b.nombre, 'es');
        }
        case 'bgg': {
          const aB = a.bgg ?? -1;
          const bB = b.bgg ?? -1;
          return bB !== aB ? bB - aB : a.nombre.localeCompare(b.nombre, 'es');
        }
        case 'tiempo':
          return a.tiempo !== b.tiempo ? a.tiempo - b.tiempo : a.nombre.localeCompare(b.nombre, 'es');
        default:
          return 0;
      }
    });

    return result;
  }, [games, filters, ratings]);

  return (
    <div className="max-w-2xl mx-auto px-3 pt-3 pb-10">
      <Filters filters={filters} onChange={setFilters} />

      <div className="mt-2 mb-2 text-xs text-gray-400 px-0.5">
        {filtered.length} juego{filtered.length !== 1 ? 's' : ''}
        {filtered.length !== games.length && ` de ${games.length}`}
      </div>

      <div className="space-y-2.5">
        {filtered.map(game => (
          <GameCard
            key={game.id}
            game={game}
            rating={getRating(game.id)}
            average={getAverage(game.id)}
            onEdit={() => setEditingGame(game)}
            onRate={() => setRatingGame(game)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-300">
            <div className="text-5xl mb-3">🎲</div>
            <p className="text-sm">Ningún juego coincide con los filtros</p>
          </div>
        )}
      </div>

      {editingGame && (
        <GameEdit
          game={editingGame}
          onSave={fields => {
            updateGame(editingGame.id, fields);
            setEditingGame(null);
          }}
          onClose={() => setEditingGame(null)}
        />
      )}

      {ratingGame && (
        <RatingModal
          game={ratingGame}
          rating={getRating(ratingGame.id)}
          onSave={newRatings => setGameRatings(ratingGame.id, newRatings)}
          onClose={() => setRatingGame(null)}
        />
      )}
    </div>
  );
}
