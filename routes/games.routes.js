const router = require("express").Router();

const { render } = require("express/lib/response");
const GameModel = require("../models/Game.model.js");

// GET "/games/create" => renderiza formulario de añadir un juego
router.get("/create", (req, res, next) => {
    res.render("games/add.hbs")
})

// POST "/games/create" => añade un objeto a la coleccion de juegos de la bd, y redirecciona al listado
router.post("/create", async (req,res,next) => {
    const { titulo, creador, descripcion, url } = req.body;

    try {
        const game = await GameModel.create( {
            titulo,
            creador,
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

    GameModel.findById(id)
    .then((game) => {
        res.render("games/details.hbs", {
            gameDetails: game
        })
    })
    .catch((err) => {
        next(err);
    })
})

// GET "/games/:id/edit" => pagina de edicion del juego seleccionado
router.get("/:id/edit", (req, res, next) => {
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
// router.get("/:id/edit", (req, res, next) => {
//     const { id } = req.params

//     const { titulo, creador, descripcion, url } = req.body;

//     GameModel.findByIdAndUpdate(id, {
//         titulo, 
//         creador, 
//         descripcion, 
//         url
//     })
//     .then((gameUpdate) => {
//         res.render(`games/details.hbs`)
//     })
    
// })


module.exports = router;
