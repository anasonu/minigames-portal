const router = require("express").Router();
const UserModel = require("../models/User.model.js");

// GET "/user/list => Renderizar una lista de usuarios registrados
router.get("/list", (req, res, next) => {
    UserModel.find()
    .then((allUsers) => {
        res.render("users/users-list.hbs", {
            userList: allUsers,
        })
    })
    .catch((err) => {
        next(err);
    })
})


// GET "/user/:id" => Renderizar la vista de perfil de un usuario identificado por su id
router.get("/:id", (req, res, next) => {
    const {id} = req.params;

    UserModel.findById(id)
    .then((user) => {
        res.render("users/user-detail.hbs", {
            userDetails: user,
        })
    })
    .catch((err) => {
        next(err);
    })
})


// GET "/user/:id/edit" => Renderizar formulario de edición de usuario
router.get("/:id/edit", (req, res, next) => {
    const {id} = req.params;
    
    UserModel.findById(id)
    .then((user) => {
        res.render("users/edit-user-detail.hbs", {
            userEdit: user,
        })
    })
    .catch((err) => {
        next(err);
    })
})

// POST "/user/:id/edit" => Enviar formulario y guardar los cambios
router.post("/:id/edit", (req, res, next) => {
    const {id} = req.params;
    console.log(req.body)
    const {username, email, admin} = req.body;
    
    UserModel.findByIdAndUpdate(id, {
        username,
        email,
        admin
    })
    .then((updatedUser) => {
        res.redirect(`/user/${id}`);
    })
    .catch((err) => {
        next(err);
    })
})




module.exports = router;