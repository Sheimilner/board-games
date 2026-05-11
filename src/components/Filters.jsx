import { useState } from 'react';

const CATEGORIAS = [
  { name: 'Familiar',    active: 'bg-green-500 text-white border-green-500',   idle: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Estrategia',  active: 'bg-blue-500 text-white border-blue-500',     idle: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Party',       active: 'bg-yellow-400 text-white border-yellow-400', idle: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { name: 'Cooperativo', active: 'bg-teal-500 text-white border-teal-500',     idle: 'bg-teal-50 text-teal-700 border-teal-200' },
  { name: 'Abstracto',   active: 'bg-gray-500 text-white border-gray-500',     idle: 'bg-gray-100 text-gray-600 border-gray-200' },
  { name: 'Trivia',      active: 'bg-orange-500 text-white border-orange-500', idle: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Palabras',    active: 'bg-violet-500 text-white border-violet-500', idle: 'bg-violet-50 text-violet-700 border-violet-200' },
  { name: 'Temático',    active: 'bg-red-500 text-white border-red-500',       idle: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'Deducción',   active: 'bg-indigo-500 text-white border-indigo-500', idle: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
];

function RangeFilter({ label, min, max, step = 1, valueMin, valueMax, onChangeMin, onChangeMax, format = v => String(v) }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-gray-700 tabular-nums">
          {format(valueMin)} – {format(valueMax)}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-6 shrink-0 text-right">Mín</span>
          <input
            type="range" min={min} max={max} step={step}
            value={valueMin}
            onChange={e => onChangeMin(Math.min(Number(e.target.value), valueMax))}
            className="flex-1 accent-blue-600 h-1"
          />
          <span className="text-xs text-gray-700 font-semibold w-12 text-right tabular-nums shrink-0">
            {format(valueMin)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-6 shrink-0 text-right">Máx</span>
          <input
            type="range" min={min} max={max} step={step}
            value={valueMax}
            onChange={e => onChangeMax(Math.max(Number(e.target.value), valueMin))}
            className="flex-1 accent-blue-600 h-1"
          />
          <span className="text-xs text-gray-700 font-semibold w-12 text-right tabular-nums shrink-0">
            {format(valueMax)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ToggleGroup({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(value === opt.value ? '' : opt.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            value === opt.value
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Filters({ filters, onChange }) {
  const [expanded, setExpanded] = useState(false);

  const update = (key, value) => onChange(prev => ({ ...prev, [key]: value }));

  const toggleCategoria = name =>
    onChange(prev => ({
      ...prev,
      categorias: prev.categorias.includes(name)
        ? prev.categorias.filter(c => c !== name)
        : [...prev.categorias, name],
    }));

  const activeCount = [
    filters.tipo,
    filters.categorias.length > 0 ? '1' : '',
    filters.portable,
    filters.jugMin > 1 || filters.jugMax < 16 ? '1' : '',
    filters.tiempoMin > 5 || filters.tiempoMax < 180 ? '1' : '',
    filters.edadMin > 4 || filters.edadMax < 18 ? '1' : '',
    filters.bggMin > 0 || filters.bggMax < 10 ? '1' : '',
    filters.propioMin > 0 || filters.propioMax < 10 ? '1' : '',
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
      {/* Search + toggle */}
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
      <select
        value={filters.sortBy}
        onChange={e => update('sortBy', e.target.value)}
        className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      >
        <option value="nombre">Ordenar: A–Z</option>
        <option value="propio">Ordenar: Mejor nuestro (↓)</option>
        <option value="bgg">Ordenar: Mejor BGG (↓)</option>
        <option value="tiempo">Ordenar: Más corto primero</option>
      </select>

      {/* Expandable filters */}
      {expanded && (
        <div className="mt-4 space-y-5 border-t border-gray-100 pt-4">

          {/* Tipo */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Tipo</p>
            <ToggleGroup
              value={filters.tipo}
              onChange={v => update('tipo', v)}
              options={[{ value: 'Cartas', label: '🃏 Cartas' }, { value: 'Mesa', label: '🎯 Mesa' }]}
            />
          </div>

          {/* Portable */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Portable</p>
            <ToggleGroup
              value={filters.portable}
              onChange={v => update('portable', v)}
              options={[{ value: 'true', label: '🎒 Solo portables' }, { value: 'false', label: 'Solo no portables' }]}
            />
          </div>

          {/* Categorías multi-select */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">
              Categorías{' '}
              {filters.categorias.length > 0 && (
                <span className="text-blue-600 font-semibold">({filters.categorias.length} seleccionada{filters.categorias.length > 1 ? 's' : ''})</span>
              )}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIAS.map(({ name, active, idle }) => {
                const sel = filters.categorias.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleCategoria(name)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${sel ? active : idle}`}
                  >
                    {sel && '✓ '}{name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Jugadores */}
          <RangeFilter
            label="Jugadores"
            min={1} max={16} step={1}
            valueMin={filters.jugMin} valueMax={filters.jugMax}
            onChangeMin={v => update('jugMin', v)}
            onChangeMax={v => update('jugMax', v)}
            format={v => `${v} jug.`}
          />

          {/* Duración */}
          <RangeFilter
            label="Duración"
            min={5} max={180} step={5}
            valueMin={filters.tiempoMin} valueMax={filters.tiempoMax}
            onChangeMin={v => update('tiempoMin', v)}
            onChangeMax={v => update('tiempoMax', v)}
            format={v => `${v} min`}
          />

          {/* Edad mínima */}
          <RangeFilter
            label="Edad mínima del juego"
            min={4} max={18} step={1}
            valueMin={filters.edadMin} valueMax={filters.edadMax}
            onChangeMin={v => update('edadMin', v)}
            onChangeMax={v => update('edadMax', v)}
            format={v => `${v}+`}
          />

          {/* BGG */}
          <RangeFilter
            label="⭐ Rating BGG"
            min={0} max={10} step={0.5}
            valueMin={filters.bggMin} valueMax={filters.bggMax}
            onChangeMin={v => update('bggMin', v)}
            onChangeMax={v => update('bggMax', v)}
            format={v => v.toFixed(1)}
          />

          {/* Nuestro */}
          <RangeFilter
            label="🎲 Nuestro puntaje"
            min={0} max={10} step={0.5}
            valueMin={filters.propioMin} valueMax={filters.propioMax}
            onChangeMin={v => update('propioMin', v)}
            onChangeMax={v => update('propioMax', v)}
            format={v => v.toFixed(1)}
          />

          {/* Limpiar */}
          {activeCount > 0 && (
            <button
              onClick={() => onChange(prev => ({
                search: prev.search,
                sortBy: prev.sortBy,
                tipo: '', categorias: [], portable: '',
                jugMin: 1, jugMax: 16,
                tiempoMin: 5, tiempoMax: 180,
                edadMin: 4, edadMax: 18,
                bggMin: 0, bggMax: 10,
                propioMin: 0, propioMax: 10,
              }))}
              className="w-full py-2.5 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors font-medium"
            >
              Limpiar filtros ({activeCount})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
