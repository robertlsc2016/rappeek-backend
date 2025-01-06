import path from "path";
import fs from "fs";
import Database from "better-sqlite3";

const dbPath = path.resolve(__dirname, "./database/database.sqlite");
// const db = new Database(dbPath, { verbose: console.log });

const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
    name TEXT NOT NULL,
    route TEXT NOT NULL,
    id_store INTEGER PRIMARY KEY,
    parent_store_type TEXT NOT NULL,
    store_type TEXT NOT NULL,
    type TEXT NOT NULL,
    banner_url TEXT NOT NULL,
    preferred_order INTEGER
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS firstProductsDay (
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  id_store INTEGER NOT NULL PRIMARY KEY,  -- Esta coluna deve ser a chave primária
  array_products_string TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS storeProducts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  id_store INTEGER NOT NULL UNIQUE,
  array_products_string TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS newProductsStore (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_store INTEGER NOT NULL,
    array_products_string TEXT NOT NULL
)`);

db.exec(
  `CREATE TABLE IF NOT EXISTS lastRun (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
);

export default db;
