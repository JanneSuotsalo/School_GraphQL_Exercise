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
const userRoute = require("./routes/userRoute");

const authRoute = require("./routes/authRoute");
const passport = require("./utils/pass");
const cors = require("cors");
const helmet = require("helmet");

//const bcrypt = require("bcrypt");
//const saltRound = 12;

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

// normally, that's the user create/update route
/*app.get("/", async (req, res) => {
  const hash = await bcrypt.hash("qwer", saltRound);
  res.send("hash of password: " + hash);
});*/

app.use("/station", stationRoute);
app.use("/connection", connectionRoute);
app.use("/connectionType", connectionTypeRoute);
app.use("/currentType", currentTypeRoute);
app.use("/level", levelRoute);

// dummy function to set user (irl: e.g. passport-local)
/*const auth = (req, res, next) => {
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
};*/

//app.use(auth);
//app.post(auth);

app.use("/auth", authRoute);
app.use("/user", userRoute);

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
    //context: {req,res,checkAuth}
  })(req, res);
});

db.on("connected", () => {
  console.log("db connected...");
});
