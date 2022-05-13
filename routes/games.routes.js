const router = require("express").Router();

const GameModel = require("../models/Game.model.js");

// GET "/games" => lista de todos los juegos
// router.get("/", (req,res,next) => {
//     GameModel.find()
//     .then((allGames) => {
//         res.render("games/list.hbs", {
//             listGames: allGames
//         })
//     })
//     .catch((err) => {
//         next(err);
//     })
// })

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


// GET "/games/:id/details" => muestra los detajes del juego seleccionado
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



module.exports = router;
