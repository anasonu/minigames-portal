const { Schema, model } = require("mongoose");

const minigameSchema = new Schema({
    imagen: {
        type: String,
        default: "https://happylearning.tv/wp-content/uploads/2017/11/portada_seccion_juegos-01.png"
    },
    titulo: {
        type: String,
        required: true
    },
    creador: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    }
})

const MinigameModel = model("minigame", minigameSchema);

module.exports = MinigameModel;



