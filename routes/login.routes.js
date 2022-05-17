const router = require("express").Router();
const UserModel = require("../models/User.model.js")
const bcryptjs = require("bcryptjs");
// const session = require('express-session');
// const isLoggedin = require("../middleware/auth.middleware.js")


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

        req.session.user = registeredUser;
        req.app.locals.userIsActive = true;

        req.app.locals.userIsAdmin = false;

        const {admin} = req.session.user;
        if(admin === true) {
            req.app.locals.userIsAdmin = true;
        }
        
        res.redirect("/profile")

    } catch (err) {
        next(err);
    }


    // ----- RUTA DE LOGOUT -----

    // POST "/login/logout" => Cierre de sesión
    router.post("/logout", (req, res, next) => {
        req.session.destroy();
        req.app.locals.userIsActive = false;
        req.app.locals.userIsAdmin = false;

        res.redirect("/");
    })

})

module.exports = router;