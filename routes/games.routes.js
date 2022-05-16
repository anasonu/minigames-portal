const router = require("express").Router();

const { render } = require("express/lib/response");
const GameModel = require("../models/Game.model.js");
const { isLoggedin } = require("../middleware/auth.middleware.js");


// GET "/games/create" => renderiza formulario de añadir un juego
router.get("/create", isLoggedin, (req, res, next) => {
    // console.log(req.session.user)
    const {_id} = req.session.user;
    res.render("games/add.hbs")
})

// POST "/games/create" => añade un objeto a la coleccion de juegos de la bd, y redirecciona al listado
router.post("/create", async (req,res,next) => {
    const { titulo, creador, descripcion, url } = req.body;
    const {_id} = req.session.user;
    // console.log(req.session.user.username)
    try {
        const game = await GameModel.create( {
            titulo,
            creador: _id,
            descripcion,
            url
        })
        res.redirect(`/games/${game._id}/details`);

    }
    catch (err) {
        next(err);
    }
})


// GET "/games/:id/details" => muestra los detalles del juego seleccionado
router.get("/:id/details", (req,res,next) => {
    const { id } = req.params;
    
    req.app.locals.esCreador = false;
    console.log("1:", req.app.locals.esCreador)
    console.log("2:", req.session.user._id)

    GameModel.findById(id)
    .then((game) => {
        console.log("3:", game.creador)
        const idCreador = GameModel.findById(id).populate("creador")
        console.log("idCreador:", idCreador)
        if (req.session.user._id === idCreador) {
            console.log("4:", req.app.locals.esCreador)
            req.app.locals.esCreador = true;
        }
        res.render("games/details.hbs", {
            gameDetails: game
        })
    })
    .catch((err) => {
        next(err);
    })
})

// GET "/games/:id/edit" => pagina de edicion del juego seleccionado
router.get("/:id/edit", isLoggedin, (req, res, next) => {
    const { id } = req.params

    GameModel.findById(id)
    .then((game) => {
        res.render(`games/edit.hbs`, {
            gameEdit: game
        })
    })
    .catch((err) => {
        next(err)
    })

})


// POST "/games/:id/edit" => edita los datos del juego seleccionado
router.post("/:id/edit", (req, res, next) => {
    const { id } = req.params

    const { titulo, creador, descripcion, url } = req.body;

    GameModel.findByIdAndUpdate(id, {
        titulo, 
        creador, 
        descripcion, 
        url
    })
    .then((gameUpdate) => {
        res.redirect(`/games/${id}/details`)
    })
    .catch((err) => {
        next(err)
    })
})


// POST "/games/:id/delete" => borra el juego seleccionado
router.post("/:id/delete", isLoggedin, async (req, res, next) => {
    const { id } = req.params;

    try {
        await GameModel.findByIdAndDelete(id)

        res.redirect("/")
    }
    catch (err) {
        next(err)
    }
    



})

module.exports = router;
