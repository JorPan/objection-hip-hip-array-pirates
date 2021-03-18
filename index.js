const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 9000;
const config = require("./knexfile")[process.env.NODE_ENV || "development"];
const database = require("knex")(config);

app.use(cors());
app.use(express.json());

app.get("/", (_, response) => {
  database("ships").then((ships) => response.json({ ships }));
});

app.listen(port, () => console.log(`listening on port ${port}`));
