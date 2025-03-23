module.exports = function (app) {
  const ProductController = require("../controllers/ProductController");

  app.post("/product", ProductController.createProduct);
  app.put("/products", ProductController.updateProductInventory);
  app.get("/products", ProductController.getProducts);
};
