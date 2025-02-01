import db from "../createDatabase";

export const ClearDatabase = () => {
  const tables = db
    .prepare(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'`
    )
    .all();

  tables.forEach(({ name }: any) => {
    if (name !== "stores") {
      db.exec(`DELETE FROM "${name}";`);
    }
  });
};
