require('dotenv').config();
const express = require('express');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventory');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', shop: "Wally's Tires Shop" });
});

app.use('/api/tires', inventoryRoutes);

// Auth route lives under /api/auth
app.post('/api/auth', (req, res) => {
  const { pin } = req.body;
  const correctPin = process.env.STAFF_PIN || '1234';
  if (pin === correctPin) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect PIN' });
  }
});

app.listen(PORT, () => {
  console.log(`🛞  Wally's Tires API running on http://localhost:${PORT}`);
});
