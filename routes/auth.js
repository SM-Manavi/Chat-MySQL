const router = require("express").Router();
const validation = require("../middleware/validation");

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);
router.post("/login", validation.loginValidation(), authController.postLogin);

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  validation.signupValidation(),
  authController.postSignup
);

module.exports = router;
