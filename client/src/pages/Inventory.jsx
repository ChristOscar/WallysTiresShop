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
    } catch {
      setError('Could not load inventory. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTires(); }, []);

  const filtered = useMemo(() => {
    return tires.filter(t => {
      if (filters.brand !== 'All' && t.brand !== filters.brand) return false;
      if (filters.width !== 'All' && String(t.width) !== filters.width) return false;
      if (filters.rimSize !== 'All' && String(t.rim_size) !== filters.rimSize) return false;
      if (filters.inStockOnly && t.quantity === 0) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const size = `${t.width}/${t.aspect_ratio}r${t.rim_size}`;
        if (!t.brand.toLowerCase().includes(q) && !size.includes(q.replace('r', '').replace('/', ''))) {
          return false;
        }
      }
      return true;
    });
  }, [tires, filters]);

  // Stats derived from full tire list
  const stats = useMemo(() => {
    const inStock = tires.filter(t => t.quantity > 0);
    const outOfStock = tires.filter(t => t.quantity === 0);
    const lowStock = tires.filter(t => t.quantity > 0 && t.quantity <= 2);
    const totalUnits = tires.reduce((sum, t) => sum + t.quantity, 0);
    const estValue = tires.reduce((sum, t) => sum + (t.price || 0) * t.quantity, 0);
    return { total: tires.length, inStock: inStock.length, outOfStock: outOfStock.length, lowStock: lowStock.length, totalUnits, estValue };
  }, [tires]);

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

  const hasActiveFilters =
    filters.search || filters.brand !== 'All' ||
    filters.width !== 'All' || filters.rimSize !== 'All' || filters.inStockOnly;

  return (
    <div className="inv-page">

      {/* ── TOP BAR ── */}
      <div className="inv-topbar">
        <div className="inv-brand">
          <span className="inv-brand-name">🛞 Wally's Tires</span>
          <span className="inv-brand-sub">Inventory Dashboard</span>
        </div>

        {/* Desktop stat pills in topbar */}
        {!loading && (
          <div className="inv-topbar-stats">
            <div className="topbar-stat">
              <span className="topbar-stat-num">{stats.total}</span>
              <span className="topbar-stat-label">SKUs</span>
            </div>
            <div className="topbar-stat">
              <span className="topbar-stat-num" style={{ color: 'var(--green)' }}>{stats.totalUnits}</span>
              <span className="topbar-stat-label">Units</span>
            </div>
            <div className="topbar-stat">
              <span className="topbar-stat-num" style={{ color: stats.outOfStock > 0 ? 'var(--red)' : 'var(--green)' }}>
                {stats.outOfStock}
              </span>
              <span className="topbar-stat-label">Out of Stock</span>
            </div>
            <div className="topbar-stat">
              <span className="topbar-stat-num">${stats.estValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
              <span className="topbar-stat-label">Est. Value</span>
            </div>
          </div>
        )}

        <div className="inv-topbar-actions">
          <button className="btn-add" onClick={() => setShowModal(true)}>+ Add Tire</button>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* ── BODY: sidebar + main ── */}
      <div className="inv-body">

        {/* Sidebar (desktop/iPad) — collapses to top bar on mobile */}
        <aside className="inv-sidebar">
          <FilterBar filters={filters} onChange={setFilters} count={filtered.length} vertical />

          {/* Sidebar stats block */}
          {!loading && (
            <div className="sidebar-stats">
              <div className="sidebar-stats-title">Inventory Overview</div>
              <div className="sidebar-stat-row">
                <span>Total SKUs</span>
                <strong>{stats.total}</strong>
              </div>
              <div className="sidebar-stat-row">
                <span>Total Units</span>
                <strong>{stats.totalUnits}</strong>
              </div>
              <div className="sidebar-stat-row">
                <span>In Stock</span>
                <strong style={{ color: 'var(--green)' }}>{stats.inStock}</strong>
              </div>
              <div className="sidebar-stat-row">
                <span>Low Stock (≤2)</span>
                <strong style={{ color: 'var(--yellow)' }}>{stats.lowStock}</strong>
              </div>
              <div className="sidebar-stat-row">
                <span>Out of Stock</span>
                <strong style={{ color: stats.outOfStock > 0 ? 'var(--red)' : 'var(--gray-mid)' }}>{stats.outOfStock}</strong>
              </div>
              <div className="sidebar-stat-divider" />
              <div className="sidebar-stat-row">
                <span>Est. Inventory Value</span>
                <strong>${stats.estValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="inv-main">

          {/* Mobile filter bar — only visible on small screens */}
          <div className="inv-mobile-filters">
            <FilterBar filters={filters} onChange={setFilters} count={filtered.length} />
          </div>

          {/* Results header */}
          {!loading && !error && (
            <div className="inv-results-header">
              <span className="inv-results-count">
                {filtered.length === tires.length
                  ? `${tires.length} tires`
                  : `${filtered.length} of ${tires.length} tires`}
              </span>
              {hasActiveFilters && (
                <button
                  className="inv-clear-filters"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  Clear filters ✕
                </button>
              )}
            </div>
          )}

          {/* States */}
          {loading && <div className="loading-state">Loading inventory...</div>}

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

          {/* Tire grid */}
          {!loading && !error && filtered.length > 0 && (
            <div className="tire-grid">
              {filtered.map(tire => (
                <TireCard
                  key={tire.id}
                  tire={tire}
                  onStock={handleStock}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <AddTireModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
