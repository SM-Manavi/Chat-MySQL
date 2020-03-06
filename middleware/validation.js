const { body } = require("express-validator");

module.exports.loginValidation = () => {
  return [emailValidation(), passwordValidation()];
};

module.exports.signupValidation = () => {
  return [emailValidation(), passwordValidation(), nameValidation()];
};

function emailValidation() {
  return body("email", "Please enter a valid email.")
    .isEmail()
    .normalizeEmail({ all_lowercase: true })
    .notEmpty();
}

function passwordValidation() {
  return body("password", "Password can't be empty").notEmpty();
  // .isLength({ min: 5 })
  // .withMessage("Password should be more than 5 char.");
}

function nameValidation() {
  return body("name", "Name can't be empty.").notEmpty();
}
