export default function TireCard({ tire, onStock, onDelete }) {
  const { id, brand, width, aspect_ratio, rim_size, type, quantity, price, condition, notes } = tire;

  const size = `${width}/${aspect_ratio}R${rim_size}`;

  let qtyClass = 'qty-green';
  let qtyLabel = `${quantity} in stock`;
  if (quantity === 0) {
    qtyClass = 'qty-red';
    qtyLabel = 'Out of stock';
  } else if (quantity <= 2) {
    qtyClass = 'qty-yellow';
    qtyLabel = `${quantity} left`;
  }

  return (
    <div className="tire-card">
      <div className="tire-card-header">
        <div>
          <div className="tire-brand">{brand}</div>
          <div className="tire-size">{size}</div>
        </div>
        <div className={`tire-qty-badge ${qtyClass}`}>{qtyLabel}</div>
      </div>

      <div className="tire-card-meta">
        <span className="tire-tag">{type}</span>
        <span className={`tire-tag ${condition === 'Used' ? 'tire-tag-used' : 'tire-tag-new'}`}>
          {condition}
        </span>
        <span className="tire-tag">{rim_size}"</span>
      </div>

      {notes && <div className="tire-notes">{notes}</div>}

      <div className="tire-card-bottom">
        <div>
          {price != null
            ? <div className="tire-price">${Number(price).toFixed(2)}</div>
            : <div className="tire-price-na">Price TBD</div>
          }
        </div>

        <div className="tire-actions">
          <button
            className="btn-stock btn-stock-add"
            title="Add 1 to stock"
            onClick={() => onStock(id, 'add')}
          >+</button>
          <button
            className="btn-stock btn-stock-remove"
            title="Remove 1 from stock"
            onClick={() => onStock(id, 'remove')}
            disabled={quantity === 0}
          >−</button>
          <button
            className="btn-delete"
            title="Delete tire"
            onClick={() => {
              if (window.confirm(`Delete ${brand} ${size}?`)) onDelete(id);
            }}
          >✕</button>
        </div>
      </div>
    </div>
  );
}
