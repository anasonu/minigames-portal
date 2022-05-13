const router = require("express").Router();

/* GET home page */
// router.get("/", (req, res, next) => {
  
//   res.render("games/list.hbs");
// });

const gameRoutes = require("./games.routes.js")
router.use("/games", gameRoutes)

// ----- RUTAS DE REGISTRO -----
const signupRoutes = require("./signup.routes.js");
router.use("/signup", signupRoutes);

// ----- RUTAS DE INICIO DE SESIÓN -----
const loginRoutes = require("./login.routes.js");
router.use("/login", loginRoutes);

module.exports = router;
