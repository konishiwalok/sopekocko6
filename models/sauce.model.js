const { Schema, model } = require("mongoose");

// Sauces model with data type
const SauceSchema = Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false },
  dislikes: { type: Number, required: false },
  imageUrl: { type: String, required: true },
  mainPepper: { type: String, required: true },
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false },
  userId: { type: String, required: true },
});

module.exports = model("Sauce", SauceSchema);
