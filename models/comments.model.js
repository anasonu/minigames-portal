const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    username: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    gameId: {
        type: Schema.Types.ObjectId,
        ref: "game",
    },
})

const CommentModel = model("comment", commentSchema);

module.exports = CommentModel;