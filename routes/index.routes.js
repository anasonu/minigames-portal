const router = require("express").Router();

const GameModel = require("../models/Game.model.js");

/* GET home page */
router.get("/", (req, res, next) => {
  GameModel.find()
  .then((allGames) => {
      res.render("games/list.hbs", {
          listGames: allGames
      })
  })
  .catch((err) => {
      next(err);
  })
});

const gameRoutes = require("./games.routes.js")
router.use("/games", gameRoutes)

const authRoutes = require("./auth.routes.js");
router.use("/signup", authRoutes);

module.exports = router;
