import express, { Request, Response } from "express";
import knex from "knex";
import knexfile from "./knexfile.js";

const db = knex(knexfile);

const app = express();
const port = 3000;

// parse JSON request bodies into req.body
app.use(express.json());

// serve the frontend (index.html, script.js, ...) from the public folder
app.use(express.static("public"));

// TOPIC: "items" is a placeholder. Rename it to the main thing your project is about.

// GET all items that are not archived
app.get("/api/items", (req: Request, res: Response) => {
  db.select("*").table("items").where({ archived: false })
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send();
    });
});

// POST a new item
app.post("/api/items", (req: Request, res: Response) => {
  // only pick the fields we allow to be set, never pass req.body straight to the database
  const itemInstance = {
    name: req.body.name,
    description: req.body.description,
  };

  db.insert(itemInstance).table("items").returning("*")
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send();
    });
});

// PATCH (partially update) one item, e.g. to archive it
app.patch("/api/items/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  // only pick the fields we allow to be changed, never pass req.body straight to the database
  const changes = {
    archived: req.body.archived,
  };

  db.update(changes).table("items").where({ id: id })
    .then((updatedRows) => {
      res.send({ updated: updatedRows });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send();
    });
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
