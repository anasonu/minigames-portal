const router = require("express").Router();
const { isLoggedin } = require("../middleware/auth.middleware.js");
const UserModel = require("../models/User.model.js");
const GameModel = require("../models/Game.model.js");
const CommentModel = require("../models/comments.model.js");
const bcryptjs = require("bcryptjs");
router.get("/", isLoggedin, (req, res, next) => {
    const userID = req.session.user._id;
    UserModel.findById(userID).populate("favoritos")
    .then((user) => {
        //console.log("info user: ", user)
        let juegosFavoritos = [];
        for (let i=0; i< user.favoritos.length; i++) {
            juegosFavoritos.push(user.favoritos[i]);
        }
    GameModel.find().populate("creador")
        .then((allGames) => {
            //console.log(allGames)
            let juegosPropios = [];
            for (let i=0; i< allGames.length; i++) {
                if (allGames[i].creador.username === user.username) {
                    juegosPropios.push(allGames[i]);
                }
            }
            res.render("profile/profile.hbs", {
                userInfo: user,
                gamesInfo: juegosPropios,
                favInfo: juegosFavoritos
            })
        })
    })
    .catch((err) => {
        next(err);
    })
})
router.get("/:id/edit", isLoggedin, (req, res, next) => {
    const { id } = req.params;
    UserModel.findById(id)
    .then((user) => {
        res.render("profile/edit-profile.hbs", {
            userEdit: user
        })
    })
    .catch((err) => {
        next(err)
    })
})
router.post("/:id/edit", isLoggedin, async (req, res, next) => {
    const { id } = req.params;
    const { username, email, password, password2 } = req.body;
    if(!username || !email) {
        UserModel.findById(id)
        .then((user) => {
            res.render("profile/edit-profile.hbs", {
                errorMessage: "El usuario y el email deben estar rellenos",
                userEdit: user
            })
        })
        .catch((err) => {
            next(err)
        })
        return;
    }
    if (password !== password2) {
        res.render("profile/edit-profile.hbs", {
            errorMessage: "¡Ups! Parece que hay campos sin rellenar",
        })
        return;
    }
    try {
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)
        await UserModel.findByIdAndUpdate(id, {
                username,
                email,
                password: hashPassword,
        })
        res.redirect("/profile");
    }
    catch(err) {
        next(err)
    }
})
module.exports = router;