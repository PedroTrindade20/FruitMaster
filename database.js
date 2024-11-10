const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(function () {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL
    );
  `);
});

db.serialize(function () {
  db.run(`
      INSERT INTO usuarios (nome, email) VALUES ('João', 'joao@example.com');
    `);
});
