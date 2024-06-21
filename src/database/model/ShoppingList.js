const mongoose = require("mongoose");
const { groceriesDB } = require("../mongoose");

const shoppingListSchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
  items: [
    {
      name: { type: String, required: true, unique: true },
      image: { type: String, required: true },
    },
  ],
});

const ShoppingList = groceriesDB.model("ShoppingList", shoppingListSchema);
module.exports = ShoppingList;
