const router = require("express").Router();

const uploader = require("../middleware/uploader.js");
const GameModel = require("../models/Game.model.js");
const { isLoggedin } = require("../middleware/auth.middleware.js");
const UserModel = require("../models/User.model.js");
const CommentModel = require("../models/comments.model.js");

// GET "/games/create" => renderiza formulario de añadir un juego
router.get("/create", isLoggedin, (req, res, next) => {
  // console.log(req.session.user)
  const { _id } = req.session.user;
  res.render("games/add.hbs");
});

// POST "/games/create" => añade un objeto a la coleccion de juegos de la bd, y redirecciona al listado
router.post("/create", uploader.single("imagen"), async (req, res, next) => {
  const { imagen, titulo, creador, descripcion, url } = req.body;
  const { _id } = req.session.user;

  if(!titulo || ! descripcion || !url) {
    // console.log(imagen);
    res.render("games/add.hbs", {
        errorMessage: "¡Ups! Parece que hay campos sin rellenar"
    })
    return;
}

  try {
    const game = await GameModel.create({
      imagen: req.file.path,
      titulo,
      creador: _id,
      descripcion,
      url,
    });
    res.redirect(`/games/${game._id}/details`);
  } catch (err) {
    next(err);
  }
});

// POST "/games/:id/details/comment/:idcomment" => Eliminar comentario
router.post("/:id/details/comment/:idcomment", (req, res, next) => {
    const {id, idcomment} = req.params;
    const { _id } = req.session.user;
    
    GameModel.findById(id)
    .then((game) => {
        CommentModel.findById(idcomment).populate("username")
        .then((comment) => {
            // const esPropietario = req.session.user.username == comment.username.username;
            // console.log("===========================", esPropietario)
            // console.log("===========================", req.session.user.username)
            // console.log("===========================", comment.username.username)
            CommentModel.findByIdAndDelete(idcomment)
            .then((response) => {
                res.redirect(`/games/${id}/details`)
            })
            .catch((err) => {
                next(err);
              });
        })
    })
    .catch((err) => {
        next(err);
    })
})

// GET "/games/:id/details" => muestra los detalles del juego seleccionado
router.get("/:id/details", (req, res, next) => {
  const { id } = req.params;
//   const { _id } = req.session.user;
req.app.locals.usuarioLoggeado = true;

  // req.app.locals.esCreador = false;
  GameModel.findById(id)
    .populate("creador")
    .then((game) => {

        if(req.session.user === undefined){
            req.app.locals.usuarioLoggeado = false;
            CommentModel.find({ gameId: game._id }).populate("username")
            .then((commentListFromDB) => {
                res.render("games/details.hbs", {
                    gameDetails: game,
                    esFavorito: false,
                    esCreador: false,
                    userComment: "",
                    commentList: commentListFromDB,
                    esPropietario: false,
                  });

            })
            return;

        }

        

      UserModel.findById(req.session.user._id)
        .then((usuario) => {
          const esFavorito = usuario.favoritos.includes(game._id);
          const esCreador = req.session.user.username == game.creador.username;
          let esPropietario;

          CommentModel.find({ gameId: game._id }).populate("username")
            .then((commentListFromDB) => {

                let commentList = JSON.parse(JSON.stringify(commentListFromDB));

                commentList.forEach((comment) =>{
                    comment.esPropietario = req.session.user.username == comment.username.username || req.session.user.admin;
                })
              res.render("games/details.hbs", {
                gameDetails: game,
                esFavorito,
                esCreador,
                userComment: usuario.username,
                commentList,
                esPropietario,
              });
            })
            .catch((err) => {
              next(err);
            });
        })
        .catch((err) => {
          next(err);
        });

    })
    .catch((err) => {
      next(err);
    });
});

// POST "/games/:id/detail/comment" => Enviar formulario de comentario y guardarlo en la vista detalle del juego
router.post("/:id/details/comment", (req, res, next) => {
  const { id } = req.params;
  const { username, message, gameId } = req.body;
  const { _id } = req.session.user;

  UserModel.findById(_id)
    .then((user) => {
      CommentModel.create({
        username: user._id,
        message,
        gameId: id,
      });
      res.redirect(`/games/${id}/details`);
    })
    .catch((err) => {
      next(err);
    });
});




// GET "/games/:id/edit" => pagina de edicion del juego seleccionado
router.get("/:id/edit", isLoggedin, (req, res, next) => {
  const { id } = req.params;

  GameModel.findById(id)
    .then((game) => {
      res.render(`games/edit.hbs`, {
        gameEdit: game,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// POST "/games/:id/edit" => edita los datos del juego seleccionado
router.post("/:id/edit", (req, res, next) => {
  const { id } = req.params;

  const { titulo, creador, descripcion, url } = req.body;

  if(!titulo || !descripcion || !url) {
    GameModel.findById(id)
    .then((game) => {
      res.render(`games/edit.hbs`, {
        errorMessage2: "Los campos del título, la descripción o la URL no pueden estar vacíos.",
        gameEdit: game,
      });
    })
    .catch((err) => {
      next(err);
    });
    return;
}

  GameModel.findByIdAndUpdate(id, {
    titulo,
    creador,
    descripcion,
    url,
  })
    .then((gameUpdate) => {
      res.redirect(`/games/${id}/details`);
    })
    .catch((err) => {
      next(err);
    });
});

// POST "games/edit-image" => Enviar formulario de cambio de imagen
router.post(
  "/:id/edit-image",
  uploader.single("imagen"),
  async (req, res, next) => {
    const { id } = req.params;

    if (!req.file) {
      const gameEdit = await GameModel.findById(id);

      res.render("games/edit.hbs", {
        gameEdit,
        errorMessage: "El campo de imagen está vacío",
      });
      return;
    }

    GameModel.findByIdAndUpdate(id, {
      imagen: req.file.path,
    })

      .then((response) => {
        res.redirect(`/games/${id}/details`);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// POST "/games/:id/delete" => borra el juego seleccionado
router.post("/:id/delete", isLoggedin, async (req, res, next) => {
  const { id } = req.params;

  try {
    await GameModel.findByIdAndDelete(id);

    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

//GET "/games/favourites" =>
// router.get("/favourites/:id", isLoggedin, (req, res, next) => {
//     const { id } = req.params;
//     const {_id} = req.session.user;

//     GameModel.findById(id).populate("creador")
//     .then((game) => {
//         //console.log(game._id.toString());

//         UserModel.findById(_id)
//         .then((infoUsuario) => {
//             if (!infoUsuario.favoritos.includes(game._id)) {
//                 req.app.locals.esFavorito = false;
//             } else {
//                 req.app.locals.esFavorito = true;
//             }
//         })
//         res.render("games/details.hbs", {
//             gameDetails: game
//         })
//     })
// })

// POST "/games/favourites" => marca el juego como favorito y lo inserta en el array de favoritos
router.post("/favourites/:id", isLoggedin, (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.session.user;

  //req.app.locals.esFavorito = false
  //req.app.locals.esFavorito;

  GameModel.findById(id)
    .populate("creador")
    .then((game) => {
      //console.log(game._id.toString());

      UserModel.findById(_id).then((infoUsuario) => {
        //console.log(infoUsuario.favoritos.includes(game._id));
        if (!infoUsuario.favoritos.includes(game._id)) {
          // req.app.locals.esFavorito = false

          UserModel.findByIdAndUpdate(_id, { $push: { favoritos: game._id } })
            .then((usuario) => {
              //res.render("games/details.hbs", {
              //    gameDetails: game
              // })
              res.redirect(`/games/${id}/details`);
            })
            .catch((err) => {
              next(err);
            });
        } else {
          // req.app.locals.esFavorito = true

          //const posicionJuego = infoUsuario.favoritos.indexOf(game._id)
          //console.log(posicionJuego);

          UserModel.findByIdAndUpdate(_id, { $pull: { favoritos: game._id } })
            .then((usuario) => {
              // res.render("games/details.hbs", {
              //     gameDetails: game
              // })
              res.redirect(`/games/${id}/details`);
            })
            .catch((err) => {
              next(err);
            });
        }
      });
    })
    .catch((err) => {
      next(err);
    });
});

// POST "/games/:buscador" => busca el juego con el nombre que escribimos en el cuadro de buscar
router.post("/:buscador", (req, res, next) => {
  const { buscador } = req.body;

  //console.log("req.body: ", buscador)
  GameModel.find()
    .populate("creador")
    .then((allGames) => {
      let juegoBuscado = [];
      //console.log("busquedaJuegos: ", allGames);
      for (let i = 0; i < allGames.length; i++) {
        if (allGames[i].titulo === buscador) {
          juegoBuscado.push(allGames[i]);
        }
      }
      res.render("games/listSearch.hbs", {
        gameSearch: juegoBuscado,
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
