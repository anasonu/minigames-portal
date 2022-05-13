const router = require("express").Router();
const UserModel = require("../models/User.model.js")

// GET "/signup" => Renderizar el formulario de registro
router.get("/", (req, res, next) => {
    res.render("auth/signup.hbs")
})

// POST "/signup" => Enviar la información del formulario de registro y registrar al usuario
router.post("/", async (req, res, next) => {
    const {username, email, password} = req.body;

    // Validación de si los campos están rellenos
    if(username === "" || email === "" || password === "") {
        res.render("auth/signup.hbs", {
            errorMessage: "¡Ups! Parece que hay campos sin rellenar"
        })
    }

    try{
        const signedUpUser = await UserModel.findOne({
            $or: [{
                email, 
                username,
            }]
        })

        if(signedUpUser) {
            res.render("auth/signup.hbs", {
                errorMessage: "Ya existe un usuario con ese nombre :("
            })
        } else {
            return;
        }
        
        res.redirect("/login")

    }
    catch(err) {
        next(err);
    }

    const signedUpUser = await UserModel.create({
            username,
            email,
            password,
        })
})

module.exports = router;