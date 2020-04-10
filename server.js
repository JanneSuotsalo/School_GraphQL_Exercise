"use strict";

require("dotenv").config();
const express = require("express");
const graphqlHTTP = require("express-graphql");
const MyGraphQLSchema = require("./schema/schema");
const db = require("./db/db");
const app = express();
const stationRoute = require("./routes/stationRoute");
const connectionRoute = require("./routes/connectionRoute");
const connectionTypeRoute = require("./routes/connectionTypeRoute");
const currentTypeRoute = require("./routes/currentTypeRoute");
const levelRoute = require("./routes/levelRoute");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/station", stationRoute);
app.use("/connection", connectionRoute);
app.use("/connectionType", connectionTypeRoute);
app.use("/currentType", currentTypeRoute);
app.use("/level", levelRoute);

app.get("/test", async (req, res) => {
  if (req.secure) {
    console.log("someone visited my url with secure https");
  } else {
    console.log("someone visited my url with normal http");
  }
});

app.use("/graphql", (req, res) => {
  graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true,
  })(req, res);
});

db.on("connected", () => {
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  if (process.env.NODE_ENV === "production") {
    const prod = require("./production")(app, process.env.PORT);
  } else {
    const localhost = require("./localhost")(
      app,
      process.env.HTTPS_PORT,
      process.env.HTTP_PORT
    );
  }
});
