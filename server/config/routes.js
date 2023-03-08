const authController = require("../controllers/auth");
const recipeController = require("../controllers/recipe");

module.exports = (app) => {
  app.use("/users", authController);
  app.use("/recipes", recipeController);
};
