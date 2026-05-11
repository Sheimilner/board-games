import { useState } from 'react';

function PersonRating({ label, value, onChange }) {
  const numVal = value === '' ? '' : Number(value);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600 w-8 text-center">
            {value === '' ? '—' : value}
          </span>
          {value !== '' && (
            <button
              onClick={() => onChange('')}
              className="text-xs text-gray-300 hover:text-red-400 transition-colors leading-none"
              title="Borrar voto"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        value={numVal || 5}
        onChange={e => onChange(e.target.value)}
        className="w-full accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-300 mt-0.5">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
      {/* Quick pick buttons */}
      <div className="flex gap-1 mt-2 flex-wrap">
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button
            key={n}
            onClick={() => onChange(String(n))}
            className={`flex-1 min-w-0 py-1 text-xs rounded font-medium transition-colors ${
              numVal === n
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RatingModal({ game, rating, onSave, onClose }) {
  const [p1, setP1] = useState(rating.p1 !== null && rating.p1 !== undefined ? String(rating.p1) : '');
  const [p2, setP2] = useState(rating.p2 !== null && rating.p2 !== undefined ? String(rating.p2) : '');

  const handleSave = () => {
    onSave({
      p1: p1 === '' ? null : Number(p1),
      p2: p2 === '' ? null : Number(p2),
    });
    onClose();
  };

  const previewAvg = (p1 !== '' && p2 !== '')
    ? ((Number(p1) + Number(p2)) / 2).toFixed(1)
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start p-4 pb-0">
          <div className="pr-2">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Puntuar</p>
            <h2 className="font-bold text-gray-900 leading-tight capitalize">{game.nombre}</h2>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-xl p-1 shrink-0">✕</button>
        </div>

        {/* Rating inputs */}
        <div className="p-4 space-y-5">
          <PersonRating label="Shei" value={p1} onChange={setP1} />
          <PersonRating label="Iara" value={p2} onChange={setP2} />
        </div>

        {/* Average preview */}
        {previewAvg && (
          <div className="mx-4 mb-3 py-2 bg-blue-50 rounded-lg text-center">
            <span className="text-sm text-blue-600 font-semibold">Promedio: {previewAvg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 p-4 pt-0">
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
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
