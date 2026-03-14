import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import TireCard from '../components/TireCard';
import AddTireModal from '../components/AddTireModal';

const API = import.meta.env.VITE_API_URL || '';

const DEFAULT_FILTERS = {
  search: '',
  brand: 'All',
  width: 'All',
  rimSize: 'All',
  inStockOnly: false,
};

export default function Inventory() {
  const navigate = useNavigate();
  const [tires, setTires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showModal, setShowModal] = useState(false);

  async function fetchTires() {
    try {
      const res = await fetch(`${API}/api/tires`);
      if (!res.ok) throw new Error('Failed to load inventory');
      const data = await res.json();
      setTires(data);
      setError('');
    } catch (err) {
      setError('Could not load inventory. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTires();
  }, []);

  const filtered = useMemo(() => {
    return tires.filter(t => {
      if (filters.brand !== 'All' && t.brand !== filters.brand) return false;
      if (filters.width !== 'All' && String(t.width) !== filters.width) return false;
      if (filters.rimSize !== 'All' && String(t.rim_size) !== filters.rimSize) return false;
      if (filters.inStockOnly && t.quantity === 0) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const size = `${t.width}/${t.aspect_ratio}r${t.rim_size}`;
        if (!t.brand.toLowerCase().includes(q) && !size.includes(q.replace('r','').replace('/',''))) {
          return false;
        }
      }
      return true;
    });
  }, [tires, filters]);

  async function handleAdd(tireData) {
    const res = await fetch(`${API}/api/tires`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tireData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add tire');
    }
    const newTire = await res.json();
    setTires(prev => [newTire, ...prev]);
  }

  async function handleStock(id, action) {
    try {
      const res = await fetch(`${API}/api/tires/${id}/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, amount: 1 }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setTires(prev => prev.map(t => t.id === id ? updated : t));
    } catch {
      alert('Failed to update stock');
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API}/api/tires/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setTires(prev => prev.filter(t => t.id !== id));
    } catch {
      alert('Failed to delete tire');
    }
  }

  function handleLogout() {
    localStorage.removeItem('wallys_auth');
    navigate('/login', { replace: true });
  }

  return (
    <div className="inv-page">
      {/* Top Bar */}
      <div className="inv-topbar">
        <div className="inv-brand">
          <span className="inv-brand-name">🛞 Wally's Tires</span>
          <span className="inv-brand-sub">Inventory</span>
        </div>
        <div className="inv-topbar-actions">
          <button className="btn-add" onClick={() => setShowModal(true)}>+ Add Tire</button>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar filters={filters} onChange={setFilters} count={filtered.length} />

      {/* Tire List */}
      <div className="tire-list">
        {loading && (
          <div className="loading-state">Loading inventory...</div>
        )}

        {!loading && error && (
          <div className="error-state">
            <strong>Error:</strong> {error}
            <br />
            <button className="btn btn-small btn-primary" style={{ marginTop: 12 }} onClick={fetchTires}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="tire-empty">
            <p>🔍</p>
            <span>No tires match your filters.</span>
          </div>
        )}

        {!loading && !error && filtered.map(tire => (
          <TireCard
            key={tire.id}
            tire={tire}
            onStock={handleStock}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Add Tire Modal */}
      {showModal && (
        <AddTireModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
