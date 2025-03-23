const { Product } = require("../models/ProductModel");

exports.createProduct = async (req, res) => {
  try {
    const { name, unitPrice, quantity } = req.body;

    const product = new Product({
      name,
      unitPrice,
      quantity
    });

    const newProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: "Product create successfully",
      product: {
        id: newProduct._id,
        name: newProduct.name,
        unitPrice: newProduct.unitPrice,
        quantity: newProduct.quantity
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error
    });
  }
};

exports.updateProductInventory = async (req, res) => {
  try {
    const { inventory } = req.body;

    const bulkUpdates = inventory.map((invItem) => ({
      updateOne: {
        filter: { _id: invItem._id },
        update: { $set: { quantity: invItem.quantity } }
      }
    }));

    const products = await Product.bulkWrite(bulkUpdates);

    return res.status(200).json({
      success: true,
      message: "Product get successfully",
      products: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    return res.status(200).json({
      success: true,
      message: "Product get successfully",
      products: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error
    });
  }
};
