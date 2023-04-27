var mkdirp = require("mkdirp");
var crypto = require("crypto");
require("dotenv").config();
var sqlite3 = require("sqlite3");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var db = new sqlite3.Database("./var/db/todos.db");

mkdirp.sync("./var/db");

mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new Schema({
  username: String,
  password: String,
  hashPass: String,
  salt: String,
});

userSchema.pre("save", (next) => {
  console.log("this", this.password);
  next();
});

userSchema.post("save", async (doc, next) => {
  console.log("New user saved:", doc);
  next();
});

UserModel = mongoose.model("user", userSchema);

// db.run(
//   "CREATE TABLE IF NOT EXISTS federated_credentials ( \
//     id INTEGER PRIMARY KEY, \
//     user_id INTEGER NOT NULL, \
//     provider TEXT NOT NULL, \
//     subject TEXT NOT NULL, \
//     UNIQUE (provider, subject) \
//   )"
// );

// db.run(
//   "CREATE TABLE IF NOT EXISTS todos ( \
//     id INTEGER PRIMARY KEY, \
//     owner_id INTEGER NOT NULL, \
//     title TEXT NOT NULL, \
//     completed INTEGER \
//   )"
// );

// // create an initial user (username: alice, password: letmein)

// db.UserModel(
//   "INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)",
//   ["alice", crypto.pbkdf2Sync("letmein", salt, 310000, 32, "sha256"), salt]
// );

module.exports = { UserModel, db };
