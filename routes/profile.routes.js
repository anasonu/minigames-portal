const router = require("express").Router();
const { isLoggedin } = require("../middleware/auth.middleware.js");

const UserModel = require("../models/User.model.js");

const bcryptjs = require("bcryptjs");

router.get("/", isLoggedin, (req, res, next) => {
    const userID = req.session.user._id;

    UserModel.findById(userID)
    .then((user) => {
        //console.log("info user: ", user)
        res.render("profile/profile.hbs", {
            userInfo: user
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

    if (password !== password2) {
        res.render("profile/edit-profile.hbs", {
            errorMessage: "Las contraseñas no coinciden"
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
