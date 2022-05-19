const router = require("express").Router();

const GameModel = require("../models/Game.model.js");

/* GET home page */
router.get("/", (req, res, next) => {
  GameModel.find().populate("creador")
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


const profileRoutes = require("./profile.routes.js")
router.use("/profile", profileRoutes)

// ----- RUTAS DE REGISTRO -----
const signupRoutes = require("./signup.routes.js");
router.use("/signup", signupRoutes);

// ----- RUTAS DE INICIO DE SESIÓN -----
const loginRoutes = require("./login.routes.js");
router.use("/login", loginRoutes);

// ----- RUTAS DE ACCESO AL ADMINISTRADOR -----
const userRoutes = require("./user.routes.js");
router.use("/user", userRoutes);

// ----- RUTA DE SUBIDA DE IMAGEN DE PORTADA DE JUEGO -----
const imageRoutes = require("./image.routes.js");
router.use("/upload", imageRoutes);

// ----- RUTA DE SECCIÓN COMENTARIOS -----
// const commentRoutes = require("./comments.routes.js");
// router.use("/games")

module.exports = router;
