const router = require("express").Router();

// ------ RUTAS DE INICIO DE SESIÓN ------

// GET "/login" => Renderizar el formulario de inicio de sesión
router.get("/", (req, res, next) => {
    res.render("auth/login.hbs");
})

module.exports = router;