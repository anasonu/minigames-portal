const router = require("express").Router();
const UserModel = require("../models/User.model.js");
const { isAdmin } = require("../middleware/auth.middleware.js");

// GET "/user/create" => Renderizar formulario de creación de un nuevo usuario
router.get("/create", (req, res, next) => {
    res.render("users/create-user.hbs");
})

// POST "/user/create" => Enviar la información del formulario y crear el usuario nuevo
router.post("/create", (req, res, next) => {
    const {username, email, password, admin} = req.body;
    if(!username || !email || !password) {
        res.render("users/create-user.hbs", {
            errorMessage: "¡Ups! Parece que hay campos sin rellenar"
        })
        return;
    }
    UserModel.create({
        username,
        email,
        password,
        admin
    })
    .then((user) => {
        res.redirect("/user/list")
    })
    .catch((err) => {
        next(err);
    })
})


// ----- CRUD: READ -----

// GET "/user/list => Renderizar una lista de usuarios registrados
router.get("/list", isAdmin, (req, res, next) => {
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
router.get("/:id", isAdmin, (req, res, next) => {
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


// ----- CRUD: UPDATE -----

// GET "/user/:id/edit" => Renderizar formulario de edición de usuario
router.get("/:id/edit", isAdmin, (req, res, next) => {
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
    const {username, email, admin} = req.body;

    if(!username || !email) {
        UserModel.findById(id)
        .then((user) => {
            res.render("users/edit-user-detail.hbs", {
                errorMessage: "El usuario y el email deben estar rellenos",
                userEdit: user,
            })
        })
        .catch((err) => {
            next(err);
        })
        return;
    }
    
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


// ----- CRUD: DELETE -----

// POST "/user/:id/delete" => Enviar formulario de eliminación de usuario y eliminar usuario
router.post("/:id/delete", (req, res, next) => {
    const {id} = req.params;

    UserModel.findByIdAndDelete(id)
    .then((response) => {
        res.redirect("/user/list");
    })
    .catch((err) => {
        next(err);
    })
})


module.exports = router;