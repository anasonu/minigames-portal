const router = require("express").Router();
const UserModel = require("../models/User.model.js");

// GET "/admin/list => Renderizar una lista de usuarios registrados
router.get("/list", (req, res, next) => {
    UserModel.find()
    .then((allUsers) => {
        res.render("admin/users-list.hbs", {
            userList: allUsers,
        })
    })
    .catch((err) => {
        next(err);
    })
})




module.exports = router;