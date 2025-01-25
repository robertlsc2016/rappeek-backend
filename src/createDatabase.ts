import path from "path";
import fs from "fs";
import Database from "better-sqlite3";

const dbPath = path.resolve(__dirname, "./database/database.sqlite");
// const db = new Database(dbPath, { verbose: console.log });

const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
    store_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    route TEXT NOT NULL,
    parent_store_type TEXT NOT NULL,
    store_type TEXT NOT NULL,
    type TEXT NOT NULL,
    banner_url TEXT NOT NULL,
    preferred_order INTEGER
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS firstProductsDay (
  store_id INTEGER NOT NULL PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  array_products_string TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS storeProducts (
  store_id INTEGER NOT NULL UNIQUE PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  array_products_string TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS newProductsStore (
    store_id INTEGER NOT NULL PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    array_products_string TEXT NOT NULL
)`);

db.exec(
  `CREATE TABLE IF NOT EXISTS lastRun (created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
);

export default db;
