const { getRecipeById } = require("../services/recipe");

module.exports = () => async (req, res, next) => {
  const id = req.params.id;

  try {
    const recipe = await getRecipeById(id);

    res.locals.recipe = {
      title: recipe.title,
      recipeImage: recipe.recipeImage,
      cookingTime: recipe.cookingTime,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      comments: recipe.comments,
      likes: recipe.likes,
      owner: recipe.owner,
    };

    next();
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Record not found" });
  }
};
