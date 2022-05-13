const router = require("express").Router();
const UserModel = require("../models/User.model.js")
const bcryptjs = require("bcryptjs");

// ------ RUTAS DE INICIO DE SESIÓN ------

// GET "/login" => Renderizar el formulario de inicio de sesión
router.get("/", (req, res, next) => {
    res.render("auth/login.hbs");
})


// POST "/login" => Enviar la información del formulario de inicio de sesión y darle acceso al portal
router.post("/", async (req, res, next) => {
    const {email, password} = req.body;

    if(email === "" || password === "") {
        res.render("auth/login.hbs", {
            errorMessage: "¡Ups! Parece que hay campos sin rellenar"
        })
        return;
    }

    try {
        const registeredUser = await UserModel.findOne({email})
        if(registeredUser === null) {
            res.render("auth/login.hbs", {
                errorMessage: "Lo sentimos, el usuario no está registrado"
            })
            return;
        }

        const passCheck = await bcryptjs.compare(password, registeredUser.password)

        if(!passCheck) {
            res.render("auth/login.hbs", {
                errorMessage: "¡Ups! La contraseña no es válida"
            })
            return;
        }
        
        res.redirect("/profile")

    } catch (err) {
        next(err);
    }

})

module.exports = router;