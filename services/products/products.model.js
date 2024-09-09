
const mongoose = require("mongoose");
const softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const productsSchema = new Schema(
    {
        image : String,
        en :{
            name : string
        },
        vn :{
            name : string
        },
    },
    { timestamps: true, collection: "products" }
);

productsSchema.plugin(softDelete);

const Products = mongoose.model("products", productsSchema);

module.exports = Products;
