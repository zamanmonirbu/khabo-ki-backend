const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userid: { type: String, required: true },
    orderItems: { type: Array, required: true },
    shippingAddress: { type: Object },
    orderAmount: { type: Number, required: true },
    isDelivered: { type: Boolean, required: true, default: false },
    transactionId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;