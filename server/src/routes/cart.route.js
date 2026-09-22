const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cart.controller");

const router = express.Router();

router.post("/", protect, addToCart);

router.get("/", protect, getCart);

router.put("/", protect, updateCartQuantity);

router.delete("/:productId", protect, removeFromCart);

router.delete("/", protect, clearCart);

module.exports = router;
