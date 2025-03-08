const express = require("express");
// const { auth } = require("../middleware/verify");
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const router = express.Router();

router.post("/createProduct", createProduct);
router.get("/getProduct/:id", getProduct);
router.get("/getAllProducts", getAllProduct);
router.put("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;
