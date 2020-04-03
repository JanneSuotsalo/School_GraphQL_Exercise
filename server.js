"use strict";

require("dotenv").config();
const express = require("express");
const graphqlHTTP = require("express-graphql");
const MyGraphQLSchema = require("./schema/schema");
const db = require("./db/db");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true
  })
);

db.on("connected", () => {
  app.listen(3000);
});
