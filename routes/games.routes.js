const router = require("express").Router();

const uploader = require("../middleware/uploader.js");
const GameModel = require("../models/Game.model.js");
const { isLoggedin } = require("../middleware/auth.middleware.js");
const UserModel = require("../models/User.model.js");


// GET "/games/create" => renderiza formulario de añadir un juego
router.get("/create", isLoggedin, (req, res, next) => {
    // console.log(req.session.user)
    const {_id} = req.session.user;
    res.render("games/add.hbs")
})

// POST "/games/create" => añade un objeto a la coleccion de juegos de la bd, y redirecciona al listado
router.post("/create", uploader.single("imagen"), async (req,res,next) => {
    const { imagen, titulo, creador, descripcion, url } = req.body;
    const {_id} = req.session.user;
    
    console.log("El archivo recibido de Cloudinary:", req.file);

    try {
        const game = await GameModel.create( {
            imagen: req.file.path,
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
    
    // req.app.locals.esCreador = false;

    GameModel.findById(id).populate("creador")
    .then((game) => {

        if(!req.app.locals.userIsActive) {
            req.app.locals.esCreador = false;
        } else if (req.session.user.username === game.creador.username) {
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

    console.log("El archivo recibido de Cloudinary:", req.file);

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

// POST "games/edit-image" => Enviar formulario de cambio de imagen
router.post("/:id/edit-image", uploader.single("imagen"), async (req, res, next) => {
    const {id} = req.params;

    if(!req.file) {
        const gameEdit = await GameModel.findById(id)
        
        res.render("games/edit.hbs", {
            gameEdit,
            errorMessage: "El campo de imagen está vacío",
        })
        return;
    }

    GameModel.findByIdAndUpdate(id, {
        imagen: req.file.path
    })

    .then((response) => {
        res.redirect(`/games/${id}/details`);
    })
    .catch((err) => {
        next(err);
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

// POST "/games/favourites" => marca el juego como favorito y lo inserta en el array de favoritos
router.post("/favourites/:id", isLoggedin, (req, res, next) => {
    const { id } = req.params;
    const {_id} = req.session.user;

    GameModel.findById(id)
    .then((game) => {
        //console.log(game._id.toString());
        UserModel.findByIdAndUpdate(_id, 
            //favoritos: favoritos.push(game._id)
            {$push: {"favoritos": game._id}}
        )
        .then((usuario) => {
            //usuario.favoritos.push(game._id.toString());
            res.render("games/details.hbs")
        })
        .catch((err) => {
            next(err)
        })
    
    })
    .catch((err) => {
        next(err)
    })

})

// POST "/games/:buscador" => busca el juego con el nombre que escribimos en el cuadro de buscar
router.post("/:buscador", (req, res, next) => {
    const { buscador } = req.body;

    //console.log("req.body: ", buscador)
    GameModel.find().populate("creador")
    .then((allGames) => {
        let juegoBuscado = [];
        //console.log("busquedaJuegos: ", allGames);
        for (let i=0;i<allGames.length; i++) {
            if (allGames[i].titulo === buscador) {
                juegoBuscado.push(allGames[i])
            }
        }
        res.render("games/listSearch.hbs", {
            gameSearch: juegoBuscado
        })

    })
    .catch((err) => {
        next(err);
    })

})





module.exports = router;
