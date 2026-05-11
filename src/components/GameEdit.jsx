import { useState } from 'react';

const CATEGORIAS = ['Familiar', 'Estrategia', 'Party', 'Cooperativo', 'Abstracto', 'Trivia', 'Palabras', 'Temático', 'Deducción'];
const TIPOS = ['Cartas', 'Mesa'];

export default function GameEdit({ game, onSave, onClose }) {
  const [form, setForm] = useState({
    nombre:      game.nombre,
    tipo:        game.tipo,
    editorial:   game.editorial,
    jugMin:      game.jugMin,
    jugMax:      game.jugMax,
    tiempo:      game.tiempo,
    categoria:   game.categoria,
    portable:    game.portable,
    edadMin:     game.edadMin,
    bgg:         game.bgg ?? '',
    descripcion: game.descripcion,
    tutorial:    game.tutorial,
    notas:       game.notas,
  });

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    onSave({
      ...form,
      jugMin:  Number(form.jugMin),
      jugMax:  Number(form.jugMax),
      tiempo:  Number(form.tiempo),
      edadMin: Number(form.edadMin),
      bgg:     form.bgg === '' ? null : Number(form.bgg),
    });
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-xl">
        {/* Sticky header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-gray-900 capitalize truncate pr-2">{game.nombre}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-xl shrink-0">✕</button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Nombre</label>
            <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)} className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Tipo</label>
              <select value={form.tipo} onChange={e => set('tipo', e.target.value)} className={inputCls}>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Categoría</label>
              <select value={form.categoria} onChange={e => set('categoria', e.target.value)} className={inputCls}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Editorial</label>
            <input type="text" value={form.editorial} onChange={e => set('editorial', e.target.value)} className={inputCls} placeholder="—" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Jug. mín</label>
              <input type="number" min="1" max="20" value={form.jugMin} onChange={e => set('jugMin', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Jug. máx</label>
              <input type="number" min="1" max="20" value={form.jugMax} onChange={e => set('jugMax', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Duración</label>
              <input type="number" min="1" max="600" value={form.tiempo} onChange={e => set('tiempo', e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Edad mín.</label>
              <input type="number" min="2" max="18" value={form.edadMin} onChange={e => set('edadMin', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">⭐ BGG (1–10)</label>
              <input
                type="number" min="1" max="10" step="0.1"
                value={form.bgg}
                onChange={e => set('bgg', e.target.value)}
                className={inputCls}
                placeholder="—"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input
              type="checkbox"
              id="portable-edit"
              checked={form.portable}
              onChange={e => set('portable', e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <label htmlFor="portable-edit" className="text-sm text-gray-700">🎒 Es portable</label>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
              rows={3}
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Tutorial (URL)</label>
            <input
              type="url"
              value={form.tutorial}
              onChange={e => set('tutorial', e.target.value)}
              className={inputCls}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Notas</label>
            <input type="text" value={form.notas} onChange={e => set('notas', e.target.value)} className={inputCls} placeholder="—" />
          </div>
        </div>

        {/* Sticky footer */}
        <div className="flex gap-2 p-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
