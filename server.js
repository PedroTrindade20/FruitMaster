const express = require("express");
const app = express();
app.get("/usuarios", (req, res) => {
  db.all("SELECT * FROM usuarios", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Erro ao acessar dados" });
    } else {
      res.json(rows);
    }
  });
});
