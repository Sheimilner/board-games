import { useGames } from './hooks/useGames';
import GameList from './components/GameList';

export default function App() {
  const { games, ratings, updateGame, setGameRatings, getRating, getAverage } = useGames();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-3 py-3 flex items-center gap-2.5">
          <span className="text-2xl leading-none">🎲</span>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight text-base">Board Game Collection</h1>
            <p className="text-xs text-gray-400">{games.length} juegos en la colección</p>
          </div>
        </div>
      </header>

      <main>
        <GameList
          games={games}
          ratings={ratings}
          updateGame={updateGame}
          setGameRatings={setGameRatings}
          getRating={getRating}
          getAverage={getAverage}
        />
      </main>
    </div>
  );
}
