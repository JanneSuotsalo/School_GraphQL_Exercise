"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const graphQlHttp = require("express-graphql");
const passport = require("./utils/pass");
const schema = require("./schema/schema");
const db = require("./db/db");
const server = express();
const helmet = require("helmet");

server.use(cors());
server.use(helmet());
server.use(express.json()); // for parsing application/json
server.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

server.use(express.static("public"));
server.use("/modules", express.static("node_modules"));

process.env.NODE_ENV = process.env.NODE_ENV || "development";
if (process.env.NODE_ENV === "production") {
  const prod = require("./production")(server, process.env.PORT);
} else {
  const localhost = require("./localhost")(
    server,
    process.env.HTTPS_PORT,
    process.env.HTTP_PORT
  );
}

server.use("/graphql", (req, res) => {
  graphQlHttp({ schema, graphiql: true, context: { req, res } })(req, res);
});

db.on("connected", () => {
  console.log("db connected");
});

//server.listen(3000); //normal http traffic
