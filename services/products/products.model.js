const mongoose = require("mongoose");
const softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const productsSchema = new Schema(
    {
        image: { type: String },
        en: {
            name: { type: String, required: true }
        },
        vn: {
            name: { type: String, required: true }
        }
    },
    { timestamps: true, collection: "products" }
);

productsSchema.plugin(softDelete);  

// Create the model
const Products = mongoose.model("products", productsSchema);

module.exports = Products;
