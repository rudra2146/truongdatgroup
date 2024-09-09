
const mongoose = require("mongoose");
const softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        content: {
            type: String,
            default: "",
        },
    },
    { timestamps: true, collection: "users" }
);

usersSchema.plugin(softDelete);

const Users = mongoose.model("users", usersSchema);

module.exports = Users;
