const db = require('./database');

const seedTires = [
  // F-150 / Truck heavy hitters — Texas staples
  { brand: 'Falken', width: 265, aspect_ratio: 70, rim_size: 17, type: 'All-Terrain', quantity: 8, price: 129.99, condition: 'New', notes: 'Popular F-150 size' },
  { brand: 'General Tire', width: 265, aspect_ratio: 70, rim_size: 17, type: 'All-Terrain', quantity: 4, price: 119.99, condition: 'New', notes: null },
  { brand: 'Cooper', width: 265, aspect_ratio: 70, rim_size: 17, type: 'Highway', quantity: 6, price: 109.99, condition: 'New', notes: null },
  { brand: 'Hankook', width: 265, aspect_ratio: 70, rim_size: 17, type: 'All-Season', quantity: 3, price: 99.99, condition: 'New', notes: null },
  { brand: 'Kumho', width: 265, aspect_ratio: 70, rim_size: 17, type: 'All-Season', quantity: 2, price: 94.99, condition: 'New', notes: null },
  { brand: 'Falken', width: 265, aspect_ratio: 70, rim_size: 17, type: 'All-Terrain', quantity: 3, price: 55.00, condition: 'Used', notes: '7/32 tread remaining' },

  // 275/65R18 — Silverado / Ram / Tundra
  { brand: 'Goodyear', width: 275, aspect_ratio: 65, rim_size: 18, type: 'All-Terrain', quantity: 4, price: 179.99, condition: 'New', notes: null },
  { brand: 'BFGoodrich', width: 275, aspect_ratio: 65, rim_size: 18, type: 'All-Terrain', quantity: 2, price: 189.99, condition: 'New', notes: 'KO2 — very popular' },
  { brand: 'Nitto', width: 275, aspect_ratio: 65, rim_size: 18, type: 'All-Terrain', quantity: 4, price: 175.99, condition: 'New', notes: 'Ridge Grappler' },
  { brand: 'Toyo', width: 275, aspect_ratio: 65, rim_size: 18, type: 'All-Terrain', quantity: 2, price: 169.99, condition: 'New', notes: 'Open Country AT3' },
  { brand: 'Cooper', width: 275, aspect_ratio: 65, rim_size: 18, type: 'Highway', quantity: 2, price: 65.00, condition: 'Used', notes: 'Good condition, 8/32' },

  // 245/75R16 — Older trucks, Tacoma, 4Runner
  { brand: 'Michelin', width: 245, aspect_ratio: 75, rim_size: 16, type: 'Highway', quantity: 4, price: 159.99, condition: 'New', notes: null },
  { brand: 'Goodyear', width: 245, aspect_ratio: 75, rim_size: 16, type: 'All-Terrain', quantity: 6, price: 134.99, condition: 'New', notes: null },
  { brand: 'Falken', width: 245, aspect_ratio: 75, rim_size: 16, type: 'All-Terrain', quantity: 4, price: 114.99, condition: 'New', notes: null },
  { brand: 'General Tire', width: 245, aspect_ratio: 75, rim_size: 16, type: 'All-Season', quantity: 2, price: 50.00, condition: 'Used', notes: '6/32 tread, good shape' },

  // Passenger car — 215/55R17
  { brand: 'Michelin', width: 215, aspect_ratio: 55, rim_size: 17, type: 'All-Season', quantity: 4, price: 149.99, condition: 'New', notes: null },
  { brand: 'Pirelli', width: 215, aspect_ratio: 55, rim_size: 17, type: 'Performance', quantity: 2, price: 165.99, condition: 'New', notes: null },
  { brand: 'Hankook', width: 215, aspect_ratio: 55, rim_size: 17, type: 'All-Season', quantity: 4, price: 94.99, condition: 'New', notes: null },
  { brand: 'Kumho', width: 215, aspect_ratio: 55, rim_size: 17, type: 'All-Season', quantity: 2, price: 45.00, condition: 'Used', notes: '7/32 tread' },

  // Passenger — 205/65R16
  { brand: 'Goodyear', width: 205, aspect_ratio: 65, rim_size: 16, type: 'All-Season', quantity: 8, price: 109.99, condition: 'New', notes: null },
  { brand: 'Cooper', width: 205, aspect_ratio: 65, rim_size: 16, type: 'All-Season', quantity: 4, price: 89.99, condition: 'New', notes: null },
  { brand: 'General Tire', width: 205, aspect_ratio: 65, rim_size: 16, type: 'All-Season', quantity: 3, price: 44.00, condition: 'Used', notes: 'Decent tread, 6/32' },

  // Passenger — 225/60R17
  { brand: 'Michelin', width: 225, aspect_ratio: 60, rim_size: 17, type: 'All-Season', quantity: 4, price: 154.99, condition: 'New', notes: null },
  { brand: 'Continental', width: 225, aspect_ratio: 60, rim_size: 17, type: 'All-Season', quantity: 4, price: 139.99, condition: 'New', notes: null },
  { brand: 'Bridgestone', width: 225, aspect_ratio: 60, rim_size: 17, type: 'All-Season', quantity: 4, price: 144.99, condition: 'New', notes: null },
  { brand: 'Kumho', width: 225, aspect_ratio: 60, rim_size: 17, type: 'All-Season', quantity: 2, price: 48.00, condition: 'Used', notes: 'Pair available' },

  // Performance / Sport sizes
  { brand: 'Pirelli', width: 245, aspect_ratio: 45, rim_size: 18, type: 'Performance', quantity: 2, price: 194.99, condition: 'New', notes: null },
  { brand: 'Nitto', width: 245, aspect_ratio: 45, rim_size: 18, type: 'Performance', quantity: 2, price: 174.99, condition: 'New', notes: null },
  { brand: 'Falken', width: 235, aspect_ratio: 45, rim_size: 18, type: 'Performance', quantity: 4, price: 119.99, condition: 'New', notes: null },

  // Large SUV / lifted truck
  { brand: 'BFGoodrich', width: 285, aspect_ratio: 70, rim_size: 17, type: 'All-Terrain', quantity: 4, price: 189.99, condition: 'New', notes: 'KO2 mud terrain' },
  { brand: 'Toyo', width: 285, aspect_ratio: 70, rim_size: 17, type: 'All-Terrain', quantity: 2, price: 179.99, condition: 'New', notes: 'Open Country MT' },
  { brand: 'Nitto', width: 285, aspect_ratio: 70, rim_size: 17, type: 'All-Terrain', quantity: 2, price: 72.00, condition: 'Used', notes: '7/32 tread' },

  // 20" rim sizes — common on newer trucks/SUVs
  { brand: 'Goodyear', width: 275, aspect_ratio: 55, rim_size: 20, type: 'Highway', quantity: 4, price: 184.99, condition: 'New', notes: null },
  { brand: 'Michelin', width: 275, aspect_ratio: 55, rim_size: 20, type: 'Highway', quantity: 2, price: 194.99, condition: 'New', notes: null },
  { brand: 'Bridgestone', width: 275, aspect_ratio: 55, rim_size: 20, type: 'All-Season', quantity: 4, price: 174.99, condition: 'New', notes: null },
  { brand: 'Cooper', width: 275, aspect_ratio: 55, rim_size: 20, type: 'Highway', quantity: 2, price: 65.00, condition: 'Used', notes: 'Good tread' },

  // Economy / budget options
  { brand: 'Hankook', width: 195, aspect_ratio: 65, rim_size: 15, type: 'All-Season', quantity: 4, price: 74.99, condition: 'New', notes: 'Budget sedan size' },
  { brand: 'Kumho', width: 195, aspect_ratio: 65, rim_size: 15, type: 'All-Season', quantity: 4, price: 69.99, condition: 'New', notes: null },
  { brand: 'General Tire', width: 185, aspect_ratio: 65, rim_size: 15, type: 'All-Season', quantity: 4, price: 40.00, condition: 'Used', notes: 'Budget car size, sold as set' },

  // Misc extra used
  { brand: 'Goodyear', width: 235, aspect_ratio: 65, rim_size: 17, type: 'All-Season', quantity: 1, price: 55.00, condition: 'Used', notes: 'Single tire available' },
  { brand: 'Bridgestone', width: 225, aspect_ratio: 65, rim_size: 17, type: 'All-Season', quantity: 2, price: 52.00, condition: 'Used', notes: null },
];

const insert = db.prepare(`
  INSERT INTO tires (brand, width, aspect_ratio, rim_size, type, quantity, price, condition, notes)
  VALUES (@brand, @width, @aspect_ratio, @rim_size, @type, @quantity, @price, @condition, @notes)
`);

const insertMany = db.transaction((tires) => {
  // Clear existing seed data
  db.exec('DELETE FROM tires');
  db.exec("DELETE FROM sqlite_sequence WHERE name='tires'");
  for (const tire of tires) {
    insert.run(tire);
  }
});

insertMany(seedTires);
console.log(`✅ Seeded ${seedTires.length} tires into the database.`);
