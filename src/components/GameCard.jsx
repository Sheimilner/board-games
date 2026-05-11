const CATEGORY_COLORS = {
  'Familiar':   'bg-green-100 text-green-800',
  'Estrategia': 'bg-blue-100 text-blue-800',
  'Party':      'bg-yellow-100 text-yellow-800',
  'Cooperativo':'bg-teal-100 text-teal-800',
  'Abstracto':  'bg-gray-100 text-gray-700',
  'Trivia':     'bg-orange-100 text-orange-800',
  'Palabras':   'bg-violet-100 text-violet-800',
  'Temático':   'bg-red-100 text-red-800',
  'Deducción':  'bg-indigo-100 text-indigo-800',
};

export default function GameCard({ game, rating, average, onEdit, onRate }) {
  const catColor = CATEGORY_COLORS[game.categoria] || 'bg-gray-100 text-gray-700';
  const hasVotes = rating.p1 !== null || rating.p2 !== null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 active:bg-gray-50 transition-colors">
      {/* Badges row + edit button */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex flex-wrap gap-1 min-w-0">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${catColor}`}>
            {game.categoria}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200 shrink-0">
            {game.tipo}
          </span>
          {game.portable && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600 shrink-0">
              🎒
            </span>
          )}
          {game.notas && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100 truncate max-w-[120px]">
              {game.notas}
            </span>
          )}
        </div>
        <button
          onClick={onEdit}
          className="text-gray-300 hover:text-gray-500 p-0.5 shrink-0 transition-colors"
          title="Editar"
        >
          ✏️
        </button>
      </div>

      {/* Game name */}
      <h3 className="font-semibold text-gray-900 text-[15px] leading-snug mb-2 capitalize">
        {game.nombre}
      </h3>

      {/* Meta info */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400 mb-2.5">
        <span>
          👥 {game.jugMin === game.jugMax ? game.jugMin : `${game.jugMin}–${game.jugMax}`}
        </span>
        <span>⏱ {game.tiempo} min</span>
        <span>👶 {game.edadMin}+</span>
        {game.editorial && <span className="truncate">📦 {game.editorial}</span>}
      </div>

      {/* Ratings */}
      <div className="flex items-end justify-between border-t border-gray-50 pt-2 gap-2">
        <div className="space-y-0.5 min-w-0">
          {/* BGG */}
          <div className="text-xs">
            {game.bgg != null
              ? <span className="text-amber-600 font-medium">⭐ BGG: {game.bgg.toFixed(1)}</span>
              : <span className="text-gray-300">⭐ BGG: —</span>
            }
          </div>
          {/* Own ratings */}
          <div className="text-xs">
            <span className={hasVotes ? 'text-blue-600' : 'text-gray-300'}>
              🎲{' '}
              <span>Shei: {rating.p1 ?? '—'}</span>
              {' · '}
              <span>Iara: {rating.p2 ?? '—'}</span>
              {average !== null && (
                <span className="text-gray-600 font-semibold"> · Prom: {average}</span>
              )}
            </span>
          </div>
        </div>
        <button
          onClick={onRate}
          className={`shrink-0 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
            hasVotes
              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {hasVotes ? '✏️ Votos' : '+ Votar'}
        </button>
      </div>
    </div>
  );
}
