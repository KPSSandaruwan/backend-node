const { default: mongoose } = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true
  },
  unitPrice: {
    type: Number,
    required: [true, "Unit price is required"]
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"]
  },
  creationDate: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = { Product };
