const Recipe = require("../models/Recipe");

function getAll() {
  return Recipe.find({});
}

function getRecipeById(id) {
  return Recipe.findById(id)
    .populate("owner", "-hashedPassword")
    .populate("comments.user", "-hashedPassword")
    .populate("likes.user", "-hashedPassword")
    .exec();
}

async function create(recipe) {
  const result = new Recipe(recipe);
  await result.save();
  return result;
}

async function updateRecipe(id, recipe) {
  const existing = await Recipe.findById(id);

  existing.title = recipe.title;
  existing.recipeImage = recipe.recipeImage;
  existing.cookingTime = recipe.cookingTime;
  existing.ingredients = recipe.ingredients;
  existing.steps = recipe.steps;
  existing.comments = recipe.comments;
  existing.likes = recipe.likes;

  await existing.save();
  return existing;
}

async function deleteRecipeById(id) {
  await Recipe.findByIdAndDelete(id);
}

module.exports = {
  getAll,
  getRecipeById,
  updateRecipe,
  create,
  deleteRecipeById,
};
