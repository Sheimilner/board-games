import { useState } from 'react';

const CATEGORIAS = ['Familiar', 'Estrategia', 'Party', 'Cooperativo', 'Abstracto', 'Trivia', 'Palabras', 'Temático', 'Deducción'];
const TIPOS = ['Cartas', 'Mesa'];

export default function Filters({ filters, onChange }) {
  const [expanded, setExpanded] = useState(false);

  const update = (key, value) => onChange(prev => ({ ...prev, [key]: value }));

  const activeCount = [
    filters.tipo,
    filters.categoria,
    filters.portable,
    filters.jugadores,
    filters.tiempoMax < 180 ? '1' : '',
    filters.edadMax < 18 ? '1' : '',
    filters.bggMin > 0 ? '1' : '',
    filters.propioMin > 0 ? '1' : '',
  ].filter(Boolean).length;

  const inputCls = "w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
      {/* Search + filter toggle */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="🔍 Buscar juego..."
          value={filters.search}
          onChange={e => update('search', e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => setExpanded(v => !v)}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors shrink-0 ${
            expanded || activeCount > 0
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          ⚙️{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
      </div>

      {/* Sort */}
      <div className="mt-2">
        <select
          value={filters.sortBy}
          onChange={e => update('sortBy', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value="nombre">Ordenar: A–Z</option>
          <option value="propio">Ordenar: Mejor nuestro (↓)</option>
          <option value="bgg">Ordenar: Mejor BGG (↓)</option>
          <option value="tiempo">Ordenar: Más corto primero</option>
        </select>
      </div>

      {/* Expandable filters */}
      {expanded && (
        <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Tipo</label>
              <select value={filters.tipo} onChange={e => update('tipo', e.target.value)} className={inputCls}>
                <option value="">Todos</option>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Categoría</label>
              <select value={filters.categoria} onChange={e => update('categoria', e.target.value)} className={inputCls}>
                <option value="">Todas</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Portable</label>
              <select value={filters.portable} onChange={e => update('portable', e.target.value)} className={inputCls}>
                <option value="">Todos</option>
                <option value="true">Solo portables 🎒</option>
                <option value="false">Solo no portables</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">N.º jugadores</label>
              <input
                type="number"
                min="1"
                max="16"
                placeholder="Ej: 4"
                value={filters.jugadores}
                onChange={e => update('jugadores', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Duración máx:{' '}
              <span className="text-gray-700 font-semibold">
                {filters.tiempoMax >= 180 ? 'sin límite' : `${filters.tiempoMax} min`}
              </span>
            </label>
            <input
              type="range" min="10" max="180" step="5"
              value={filters.tiempoMax}
              onChange={e => update('tiempoMax', Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Edad mínima del juego:{' '}
              <span className="text-gray-700 font-semibold">
                {filters.edadMax >= 18 ? 'sin límite' : `hasta ${filters.edadMax}+`}
              </span>
            </label>
            <input
              type="range" min="4" max="18" step="1"
              value={filters.edadMax}
              onChange={e => update('edadMax', Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              ⭐ BGG mínimo:{' '}
              <span className="text-amber-600 font-semibold">
                {filters.bggMin === 0 ? 'sin filtro' : `≥ ${filters.bggMin}`}
              </span>
            </label>
            <input
              type="range" min="0" max="9" step="0.5"
              value={filters.bggMin}
              onChange={e => update('bggMin', Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              🎲 Nuestro mínimo:{' '}
              <span className="text-blue-600 font-semibold">
                {filters.propioMin === 0 ? 'sin filtro' : `≥ ${filters.propioMin}`}
              </span>
            </label>
            <input
              type="range" min="0" max="9" step="0.5"
              value={filters.propioMin}
              onChange={e => update('propioMin', Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {activeCount > 0 && (
            <button
              onClick={() => onChange(prev => ({
                ...prev,
                tipo: '', categoria: '', portable: '', jugadores: '',
                tiempoMax: 180, edadMax: 18, bggMin: 0, propioMin: 0,
              }))}
              className="w-full py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Limpiar filtros ({activeCount})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
