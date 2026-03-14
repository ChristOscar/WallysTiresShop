import { useState } from 'react';

const BRANDS = [
  'BFGoodrich', 'Bridgestone', 'Continental', 'Cooper', 'Falken',
  'Firestone', 'General Tire', 'Goodyear', 'Hankook', 'Kumho',
  'Michelin', 'Nitto', 'Pirelli', 'Toyo', 'Other',
];

const WIDTHS = ['185', '195', '205', '215', '225', '235', '245', '255', '265', '275', '285', '295', '305', '315', '325'];
const ASPECTS = ['30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80'];
const RIM_SIZES = ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '24'];
const TYPES = ['All-Season', 'All-Terrain', 'Highway', 'Performance', 'Winter', 'Mud-Terrain'];
const CONDITIONS = ['New', 'Used'];

const DEFAULTS = {
  brand: 'Goodyear',
  width: '265',
  aspect_ratio: '70',
  rim_size: '17',
  type: 'All-Season',
  quantity: '1',
  price: '',
  condition: 'New',
  notes: '',
};

export default function AddTireModal({ onClose, onAdd }) {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onAdd({
        ...form,
        width: Number(form.width),
        aspect_ratio: Number(form.aspect_ratio),
        rim_size: Number(form.rim_size),
        quantity: Number(form.quantity),
        price: form.price ? Number(form.price) : null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add tire. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Add New Tire">
        <div className="modal-header">
          <h2 className="modal-title">Add New Tire</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Brand</label>
              <select value={form.brand} onChange={e => update('brand', e.target.value)}>
                {BRANDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Width (mm)</label>
              <select value={form.width} onChange={e => update('width', e.target.value)}>
                {WIDTHS.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Aspect Ratio</label>
              <select value={form.aspect_ratio} onChange={e => update('aspect_ratio', e.target.value)}>
                {ASPECTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Rim Size (in)</label>
              <select value={form.rim_size} onChange={e => update('rim_size', e.target.value)}>
                {RIM_SIZES.map(r => <option key={r}>{r}"</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Type</label>
              <select value={form.type} onChange={e => update('type', e.target.value)}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={e => update('quantity', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 129.99"
                value={form.price}
                onChange={e => update('price', e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label>Condition</label>
              <select value={form.condition} onChange={e => update('condition', e.target.value)}>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Notes (optional)</label>
              <textarea
                placeholder="e.g. 7/32 tread remaining, popular F-150 size..."
                value={form.notes}
                onChange={e => update('notes', e.target.value)}
              />
            </div>
          </div>

          {error && <div className="error-state" style={{ margin: '16px 0 0', padding: '12px 16px' }}>{error}</div>}

          <div className="modal-footer">
            <button type="button" className="btn btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Tire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
