const express = require("express");
// const { auth } = require("../middleware/verify");
const {
  createOrder,
  getOrder,
  getAllOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

router.post("/createOrder", createOrder);
router.get("/getOrder/:id", getOrder);
router.get("/getAllOrder", getAllOrder);
router.put("/updateOrderStatus/:id", updateOrderStatus);
router.delete("/deleteOrder/:id", deleteOrder);
module.exports = router;
