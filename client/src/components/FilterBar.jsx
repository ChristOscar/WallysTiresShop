const BRANDS = [
  'All', 'BFGoodrich', 'Bridgestone', 'Continental', 'Cooper', 'Falken',
  'General Tire', 'Goodyear', 'Hankook', 'Kumho', 'Michelin', 'Nitto',
  'Pirelli', 'Toyo',
];

const WIDTHS = ['All', '185', '195', '205', '215', '225', '235', '245', '265', '275', '285', '305'];
const RIM_SIZES = ['All', '13', '14', '15', '16', '17', '18', '19', '20', '22'];

// vertical = sidebar mode (desktop), default = horizontal bar (mobile/tablet)
export default function FilterBar({ filters, onChange, count, vertical = false }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  if (vertical) {
    return (
      <div className="filter-sidebar">
        <div className="filter-sidebar-title">Filters</div>

        <div className="filter-sidebar-group">
          <label className="filter-sidebar-label">Search</label>
          <input
            className="filter-search"
            type="search"
            placeholder="Brand or size..."
            value={filters.search}
            onChange={e => update('search', e.target.value)}
          />
        </div>

        <div className="filter-sidebar-group">
          <label className="filter-sidebar-label">Brand</label>
          <select
            className="filter-select filter-select-full"
            value={filters.brand}
            onChange={e => update('brand', e.target.value)}
          >
            {BRANDS.map(b => <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>)}
          </select>
        </div>

        <div className="filter-sidebar-group">
          <label className="filter-sidebar-label">Width</label>
          <select
            className="filter-select filter-select-full"
            value={filters.width}
            onChange={e => update('width', e.target.value)}
          >
            {WIDTHS.map(w => <option key={w} value={w}>{w === 'All' ? 'All Widths' : w + 'mm'}</option>)}
          </select>
        </div>

        <div className="filter-sidebar-group">
          <label className="filter-sidebar-label">Rim Size</label>
          <select
            className="filter-select filter-select-full"
            value={filters.rimSize}
            onChange={e => update('rimSize', e.target.value)}
          >
            {RIM_SIZES.map(r => <option key={r} value={r}>{r === 'All' ? 'All Rim Sizes' : r + '"'}</option>)}
          </select>
        </div>

        <label className={`filter-stock-toggle${filters.inStockOnly ? ' active' : ''}`} style={{ width: '100%' }}>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={e => update('inStockOnly', e.target.checked)}
          />
          In Stock Only
        </label>

        <div className="filter-sidebar-count">
          {count === 1 ? '1 tire' : `${count} tires`} shown
        </div>
      </div>
    );
  }

  // Horizontal bar (mobile)
  return (
    <div className="filter-bar">
      <input
        className="filter-search"
        type="search"
        placeholder="Search brand or size (e.g. 265/70R17)..."
        value={filters.search}
        onChange={e => update('search', e.target.value)}
      />
      <div className="filter-row">
        <select className="filter-select" value={filters.brand} onChange={e => update('brand', e.target.value)}>
          {BRANDS.map(b => <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>)}
        </select>
        <select className="filter-select" value={filters.width} onChange={e => update('width', e.target.value)}>
          {WIDTHS.map(w => <option key={w} value={w}>{w === 'All' ? 'Width' : w + 'mm'}</option>)}
        </select>
        <select className="filter-select" value={filters.rimSize} onChange={e => update('rimSize', e.target.value)}>
          {RIM_SIZES.map(r => <option key={r} value={r}>{r === 'All' ? 'Rim' : r + '"'}</option>)}
        </select>
      </div>
      <div className="filter-row">
        <label className={`filter-stock-toggle${filters.inStockOnly ? ' active' : ''}`}>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={e => update('inStockOnly', e.target.checked)}
          />
          In Stock Only
        </label>
        <span className="filter-results">{count === 1 ? '1 tire' : `${count} tires`}</span>
      </div>
    </div>
  );
}
