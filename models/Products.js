const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: String, required: true },
  quantity: { type: String, required: true },
  size: { type: String, required: true },
  image: { type: String },
});

module.exports = mongoose.model("Products", ProductsSchema);
