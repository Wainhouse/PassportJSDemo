var express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
const { UserModel } = require("../db");

passport.use(
  new LocalStrategy(function verify(username, hashPass, salt, cb) {
    UserModel.findOne({ username: username }).then((user) => {
      console.log(user);
      if (!user) {
        return err;
      }
      crypto.pbkdf2(
        hashPass,
        salt,
        310000,
        32,
        "sha256",
        function (err, hashedPassword) {
          if (err) {
            return cb(err);
          }
          if (!crypto.timingSafeEqual(hashPass, hashedPassword)) {
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }
          return cb(null, row);
        }
      );
    });
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

var router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  console.log(req.body);
  var salt = crypto.randomBytes(16);
  const hashPass = crypto.pbkdf2Sync(password, salt, 310000, 32, "sha256");
  const newUser = await UserModel.create({ username, hashPass, salt });
  console.log("user created");
  res.status(201).send(newUser);
});
router.get("/login", function (req, res, next) {
  console.log(res.render);
  res.render("login");
});

router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = router;
