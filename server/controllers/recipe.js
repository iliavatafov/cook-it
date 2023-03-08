const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { isAuth, isOwner } = require("../middlewares/guards");
const preload = require("../middlewares/preload");

const api = require("../services/recipe");
const mapErrors = require("../utils/mapper");

router.get("/", async (req, res) => {
  try {
    const recipies = await api.getAll();
    res.json(recipies);
  } catch (error) {
    const err = mapErrors(error);
    res.status(404).json(err);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const recipie = await api.getRecipeById(id);
    res.json(recipie);
  } catch (error) {
    const err = mapErrors(error);
    res.status(404).json(err);
  }
});

router.post(
  "/",
  isAuth(),
  [
    body("title", "Title is required").notEmpty(),
    body("cookingTime.hours", "The hours field is required").notEmpty(),
    body("cookingTime.minutes", "The minutes field is required").notEmpty(),
    body("ingredients", "Ingredients are required").isArray({ min: 1 }),
    body("steps", "Steps are required").isArray({ min: 1 }),
    body("steps.*.description", "Description is required").notEmpty(),
    body("owner", "Owner is required").notEmpty(),
  ],
  async (req, res) => {
    const item = {
      title: req.body.title,
      recipeImage: req.body.recipeImage,
      cookingTime: req.body.cookingTime,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      comments: req.body.comments,
      likes: req.body.likes,
      owner: req.user._id,
    };

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(
          errors.errors.map((e) => ({
            msg: e.msg,
          }))
        );
      }

      const result = await api.create(item);
      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      const err = mapErrors(error);
      res.status(400).json(err);
    }
  }
);

router.put(
  "/:id",
  preload(),
  isOwner(),
  [
    body("title", "Title is required").notEmpty(),
    body("cookingTime.hours", "The hours field is required").notEmpty(),
    body("cookingTime.minutes", "The minutes field is required").notEmpty(),
    body("ingredients", "Ingredients are required").isArray({ min: 1 }),
    body("steps", "Steps are required").isArray({ min: 1 }),
    body("steps.*.description", "Description is required").notEmpty(),
    body("owner", "Owner is required").notEmpty(),
  ],
  async (req, res) => {
    const itemId = req.params.id;
    const item = {
      title: req.body.title,
      recipeImage: req.body.recipeImage,
      cookingTime: req.body.cookingTime,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      comments: req.body.comments,
      likes: req.body.likes,
      owner: req.user._id,
    };

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(
          errors.errors.map((e) => ({
            msg: e.msg,
          }))
        );
      }
      const result = await api.updateRecipe(itemId, item);
      res.json(result);
    } catch (error) {
      const err = mapErrors(error);
      res.status(400).json({ message: err });
    }
  }
);

router.delete("/:id", preload(), isOwner(), async (req, res) => {
  const itemId = req.params.id;

  try {
    await api.deleteRecipeById(itemId);
    res.status(204).end();
  } catch (error) {
    const err = mapErrors(error);
    res.status(400).json({ message: err });
  }
});

module.exports = router;
