const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  full_name: String,
});

module.exports = mongoose.model("User", userSchema);

/*const getUser = (id) => {
  const user = users.filter((usr) => {
    if (usr.id === id) {
      delete usr.password;
      return usr;
    }
  });
  return user[0];
};

const getUserLogin = (email) => {
  const user = users.filter((usr) => {
    if (usr.email === email) {
      return usr;
    }
  });
  return user[0];
};

module.exports = {
  users,
  getUser,
  getUserLogin,
};
*/

/*"use strict";
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@metropolia.fi",
    password: "$2b$12$fzSGvZ6zSdzhWu8pQRiL4Op9BTucUrXbaya7gzC5Q.U3a6A1Um712",
  },
  {
    id: "2",
    name: "Jane Doez",
    email: "jane@metropolia.fi",
    password: "$2b$12$Ix.kzU0UXwhnYONfpeLBWeys6einEgEdVkO3Cc/uItTYYzybgRUqm",
  },
];*/
