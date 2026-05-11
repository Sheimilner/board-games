import { useState, useMemo } from 'react';
import GameCard from './GameCard';
import Filters from './Filters';
import GameEdit from './GameEdit';
import RatingModal from './RatingModal';

const DEFAULT_FILTERS = {
  search:     '',
  sortBy:     'nombre',
  tipo:       '',
  categorias: [],
  portable:   '',
  jugMin:     1,
  jugMax:     16,
  tiempoMin:  5,
  tiempoMax:  180,
  edadMin:    4,
  edadMax:    18,
  bggMin:     0,
  bggMax:     10,
  propioMin:  0,
  propioMax:  10,
};

export default function GameList({ games, ratings, updateGame, setGameRatings, getRating, getAverage }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [editingGame, setEditingGame] = useState(null);
  const [ratingGame, setRatingGame]   = useState(null);

  const filtered = useMemo(() => {
    const avg = (gameId) => {
      const r = ratings[gameId] || { p1: null, p2: null };
      const vals = [r.p1, r.p2].filter(v => v !== null && v !== undefined);
      if (vals.length === 0) return null;
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    };

    let result = [...games];

    // Text search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(g => g.nombre.toLowerCase().includes(q));
    }

    // Tipo
    if (filters.tipo) {
      result = result.filter(g => g.tipo === filters.tipo);
    }

    // Categorías (multi): juego debe pertenecer a alguna de las seleccionadas
    if (filters.categorias.length > 0) {
      result = result.filter(g => filters.categorias.includes(g.categoria));
    }

    // Portable
    if (filters.portable !== '') {
      result = result.filter(g => g.portable === (filters.portable === 'true'));
    }

    // Jugadores: mostrar juegos que soporten algún número dentro del rango elegido
    if (filters.jugMin > 1 || filters.jugMax < 16) {
      result = result.filter(g => g.jugMin <= filters.jugMax && g.jugMax >= filters.jugMin);
    }

    // Duración
    if (filters.tiempoMin > 5 || filters.tiempoMax < 180) {
      result = result.filter(g => g.tiempo >= filters.tiempoMin && g.tiempo <= filters.tiempoMax);
    }

    // Edad mínima del juego
    if (filters.edadMin > 4 || filters.edadMax < 18) {
      result = result.filter(g => g.edadMin >= filters.edadMin && g.edadMin <= filters.edadMax);
    }

    // BGG
    if (filters.bggMin > 0 || filters.bggMax < 10) {
      result = result.filter(g =>
        g.bgg != null && g.bgg >= filters.bggMin && g.bgg <= filters.bggMax
      );
    }

    // Nuestro puntaje
    if (filters.propioMin > 0 || filters.propioMax < 10) {
      result = result.filter(g => {
        const a = avg(g.id);
        return a !== null && a >= filters.propioMin && a <= filters.propioMax;
      });
    }

    // Ordenamiento
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
