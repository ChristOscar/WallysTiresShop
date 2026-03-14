const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/tires — list all tires with optional filters
router.get('/', (req, res) => {
  const { brand, rimSize, width, condition, search } = req.query;

  let query = 'SELECT * FROM tires WHERE 1=1';
  const params = [];

  if (brand && brand !== 'All') {
    query += ' AND brand = ?';
    params.push(brand);
  }
  if (rimSize) {
    query += ' AND rim_size = ?';
    params.push(Number(rimSize));
  }
  if (width) {
    query += ' AND width = ?';
    params.push(Number(width));
  }
  if (condition && condition !== 'All') {
    query += ' AND condition = ?';
    params.push(condition);
  }
  if (search) {
    query += ' AND (LOWER(brand) LIKE ? OR CAST(width AS TEXT) || "/" || CAST(aspect_ratio AS TEXT) || "R" || CAST(rim_size AS TEXT) LIKE ?)';
    const term = `%${search.toLowerCase()}%`;
    params.push(term, `%${search}%`);
  }

  query += ' ORDER BY brand ASC, width ASC, rim_size ASC';

  try {
    const tires = db.prepare(query).all(...params);
    res.json(tires);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tires' });
  }
});

// POST /api/tires — add new tire
router.post('/', (req, res) => {
  const { brand, width, aspect_ratio, rim_size, type, quantity, price, condition, notes } = req.body;

  if (!brand || !width || !aspect_ratio || !rim_size || !type) {
    return res.status(400).json({ error: 'Missing required fields: brand, width, aspect_ratio, rim_size, type' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO tires (brand, width, aspect_ratio, rim_size, type, quantity, price, condition, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      brand,
      Number(width),
      Number(aspect_ratio),
      Number(rim_size),
      type,
      Number(quantity) || 0,
      price ? Number(price) : null,
      condition || 'New',
      notes || null
    );
    const newTire = db.prepare('SELECT * FROM tires WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newTire);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create tire' });
  }
});

// PATCH /api/tires/:id — update tire (quantity, price, or any field)
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const allowed = ['brand', 'width', 'aspect_ratio', 'rim_size', 'type', 'quantity', 'price', 'condition', 'notes'];
  const updates = Object.keys(req.body).filter(k => allowed.includes(k));

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const setClause = updates.map(k => `${k} = ?`).join(', ');
  const values = updates.map(k => req.body[k]);

  try {
    const stmt = db.prepare(`UPDATE tires SET ${setClause} WHERE id = ?`);
    const result = stmt.run(...values, Number(id));
    if (result.changes === 0) return res.status(404).json({ error: 'Tire not found' });
    const updated = db.prepare('SELECT * FROM tires WHERE id = ?').get(Number(id));
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update tire' });
  }
});

// DELETE /api/tires/:id — delete a tire
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const result = db.prepare('DELETE FROM tires WHERE id = ?').run(Number(id));
    if (result.changes === 0) return res.status(404).json({ error: 'Tire not found' });
    res.json({ success: true, id: Number(id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete tire' });
  }
});

// POST /api/tires/:id/stock — quick stock adjustment
router.post('/:id/stock', (req, res) => {
  const { id } = req.params;
  const { action, amount = 1 } = req.body;

  if (!['add', 'remove'].includes(action)) {
    return res.status(400).json({ error: 'action must be "add" or "remove"' });
  }

  try {
    const tire = db.prepare('SELECT * FROM tires WHERE id = ?').get(Number(id));
    if (!tire) return res.status(404).json({ error: 'Tire not found' });

    const delta = action === 'add' ? Number(amount) : -Number(amount);
    const newQty = Math.max(0, tire.quantity + delta);

    db.prepare('UPDATE tires SET quantity = ? WHERE id = ?').run(newQty, Number(id));
    const updated = db.prepare('SELECT * FROM tires WHERE id = ?').get(Number(id));
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

// GET /api/tires/brands — get distinct brands for filter dropdowns
router.get('/brands', (req, res) => {
  try {
    const brands = db.prepare('SELECT DISTINCT brand FROM tires ORDER BY brand ASC').all();
    res.json(brands.map(b => b.brand));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// GET /api/auth — verify PIN
router.post('/auth', (req, res) => {
  const { pin } = req.body;
  const correctPin = process.env.STAFF_PIN || '1234';
  if (pin === correctPin) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect PIN' });
  }
});

module.exports = router;
