const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  small: { type: Number, required: true },
  medium: { type: Number, required: true },
  large: { type: Number, required: true }
});

const foodSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  variants: [{ type: String, required: true }],
  prices: [priceSchema],
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', foodSchema);
