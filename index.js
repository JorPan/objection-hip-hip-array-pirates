const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 9000;
const config = require("./knexfile")[process.env.NODE_ENV || "development"];
const database = require("knex")(config);
const { Model } = require("objection");

app.use(cors());
app.use(express.json());

Model.knex(database);

class Pirate extends Model {
  // static tableName = "pirates"
  static get tableName() {
    return "pirates";
  }
}

class Ship extends Model {
  // static tableName = "ships"
  static get tableName() {
    return "ships";
  }

  static relationMappings = {
    pirates: {
      relation: Model.HasManyRelation,
      modelClass: Pirate,
      join: {
        from: "ships.id",
        to: "pirates.ship_id",
      },
    },
  };
}

app.get("/ships", (_, response) => {
  Ship.query()
    .withGraphFetched("pirates") //INCLUDES PIRATES IN THE SHIP QUERY
    .then((ships) => response.json({ ships }));
});

app.get("/pirates", (_, response) => {
  Pirate.query().then((pirates) => response.json({ pirates }));
});

app.listen(port, () => console.log(`listening on port ${port}`));
