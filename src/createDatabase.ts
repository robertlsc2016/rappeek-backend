import path from "path";
import fs from "fs";

import Database from "better-sqlite3";

// Defina o caminho do banco de dados
const dbPath = path.resolve(__dirname, "./database/database.sqlite");

// Certifique-se de que a pasta existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// db.exec(`
//     CREATE TABLE IF NOT EXISTS stores (
//     store_id INTEGER PRIMARY KEY,
//     name TEXT NOT NULL,
//     route TEXT NOT NULL,
//     parent_store_type TEXT NOT NULL,
//     store_type TEXT NOT NULL,
//     type TEXT NOT NULL,
//     banner_url TEXT NOT NULL,
//     preferred_order INTEGER
//   )
// `);

// db.exec(`
//   CREATE TABLE IF NOT EXISTS firstProductsDay (
//   store_id INTEGER NOT NULL PRIMARY KEY,
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   array_products_string TEXT NOT NULL
// )`);

// db.exec(`CREATE TABLE IF NOT EXISTS storeProducts (
//   store_id INTEGER NOT NULL UNIQUE PRIMARY KEY,
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   array_products_string TEXT NOT NULL
// )`);

// db.exec(`CREATE TABLE IF NOT EXISTS newProductsStore (
//     store_id INTEGER NOT NULL PRIMARY KEY,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     array_products_string TEXT NOT NULL
// )`);

// db.exec(
//   `CREATE TABLE IF NOT EXISTS lastRun (created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
// );

// db.exec(`DROP TABLE IF EXISTS products`);

db.exec(
  `CREATE TABLE IF NOT EXISTS products (
  store_id INTEGER NOT NULL,
  id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  discount REAL NOT NULL,
  real_price REAL NOT NULL,
  image_url TEXT,
  quantity INTEGER NOT NULL,
  unit_type TEXT,
  pum TEXT,
  stock INTEGER NOT NULL,
  navigation TEXT,
  PRIMARY KEY (store_id, id, product_id))`
);

export default db;
