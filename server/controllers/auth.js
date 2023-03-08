const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const { isGuest } = require("../middlewares/guards");
const { register, login, logout } = require("../services/auth");
const mapErrors = require("../utils/mapper");

router.post(
  "/register",
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email address"),
  body("username")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Username should be at least two characters long"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  isGuest(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(
          errors.errors.map((e) => ({
            msg: e.msg,
          }))
        );
      }
      if (
        req.body.email == "" ||
        req.body.username == "" ||
        req.body.password == "" ||
        req.body.repass == ""
      ) {
        throw new Error("All fields are required");
      }

      if (req.body.password != req.body.repass.trim()) {
        throw new Error("Password and repeat password should be equal");
      }

      const result = await register(
        req.body.email.trim().toLowerCase(),
        req.body.username.trim().toLowerCase(),
        req.body.password.trim()
      );

      res.status(201).json(result);
    } catch (error) {
      const err = mapErrors(error);
      res.status(400).json(err);
    }
  }
);

router.post(
  "/login",
  body("email").trim().normalizeEmail(),
  isGuest(),
  async (req, res) => {
    try {
      if (
        req.body.email == "" ||
        req.body.email == "@" ||
        req.body.password == ""
      ) {
        throw new Error("All fields are required");
      }
      const result = await login(req.body.email, req.body.password.trim());

      res.json(result);
    } catch (error) {
      const err = mapErrors(error);
      res.status(400).json(err);
    }
  }
);

router.get("/logout", (req, res) => {
  logout(req.user?.token);
  res.status(204).end();
});

module.exports = router;
