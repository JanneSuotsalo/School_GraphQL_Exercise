"use strict";

require("dotenv").config();
const express = require("express");
const graphqlHTTP = require("express-graphql");
const MyGraphQLSchema = require("./schema/schema");
const db = require("./db/db");
const app = express();
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const passport = require("./utils/pass");
const cors = require("cors");
const helmet = require("helmet");

app.use(cors());
app.use(helmet());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

// dummy function to check authentication (irl: e.g. passport-jwt)
const checkAuth = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      throw new Error("Not authenticated");
    }
  })(req, res);
};

app.use("/auth", authRoute);
app.use("/user", userRoute);

app.use("/graphql", (req, res) => {
  graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true,
    context: { req, res, checkAuth },
  })(req, res);
});

db.on("connected", () => {
  console.log("db connected...");
});
