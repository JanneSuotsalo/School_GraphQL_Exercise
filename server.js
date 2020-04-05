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

app.use("/graphql", (req, res) => {
  graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true,
  })(req, res);
});

db.on("connected", () => {
  app.listen(3000);
});

/* 
const authRoute = require("./routes/authRoute");
const passport = require("./utils/pass");
const cors = require("cors");

app.use(cors());

// dummy function to set user (irl: e.g. passport-local)
const auth = (req, res, next) => {
  req.user = false;
  next();
};

// dummy function to check authentication (irl: e.g. passport-jwt)
const checkAuth = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      throw new Error("Not authenticated");
    }
  })(req, res);
};

//app.use(auth);
//app.post(auth);

app.use("/auth", authRoute); */
