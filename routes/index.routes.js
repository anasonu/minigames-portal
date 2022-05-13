const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("games/list.hbs");
});

const gameRoutes = require("./games.routes.js")
router.use("/games", gameRoutes)

const authRoutes = require("./auth.routes.js");
router.use("/signup", authRoutes);

module.exports = router;
