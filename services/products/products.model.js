const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    Img: { type: String, required: true },  // Image path
    cardTitle: { type: String, required: true }  // Title of the product
  },
  { _id: false }  // Disable creating _id for nested documents
);

const productsSchema = new mongoose.Schema(
  {
    bannerTitle: { type: String, required: true },
    product: {
      Title: { type: String, required: true },  // Title for the product category
      btn: { type: String, required: true },    // Button text
      products: { type: [productSchema] }  // Array of products
    },
    language: { type: String, default: 'vn' }
  },
  { timestamps: true, collection: "products" }  // Collection name and timestamps
);

const Product = mongoose.model("Product", productsSchema);

module.exports = Product;
