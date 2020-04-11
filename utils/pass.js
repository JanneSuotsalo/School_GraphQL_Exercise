"use strict";
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const userModel = require("../models/userModel");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcrypt");

// local strategy for username password login
passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await userModel.getUserLogin(username);
      console.log("Local strategy", user); // result is binary row
      if (user === undefined) {
        return done(null, false, { message: "Incorrect email." });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: "Incorrect password." });
      }
      delete user.password;
      return done(null, { ...user }, { message: "Logged In Successfully" }); // use spread syntax to create shallow copy to get rid of binary row type
    } catch (err) {
      return done(err);
    }
  })
);

// TODO: JWT strategy for handling bearer token
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "asd123",
    },
    (jwtPayload, done) => {
      console.log("payload", jwtPayload);
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      const user = userModel.getUser(jwtPayload.id);
      console.log("pl user", user);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }
  )
);

module.exports = passport;
