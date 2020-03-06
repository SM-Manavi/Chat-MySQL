const { validationResult } = require("express-validator");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const jwtSecret = "lskflsjkdflksdlfsdlkfdkslfsdklfsdfldsflksdf";

const User = require('../utils/database').model("user");

module.exports.getLogin = (req, res, next)=>{
    res.render('login-signup', {pageTitle : "Login", path : '/login'})
}


module.exports.postLogin = (req, res, next) => {
  const errors = validationResult(req).errors;
  if (errors.length > 0) {
    const error = new Error("Validation failed");
    error.statusCode = 400;
    errorsMsg = errors.map(function(value) {
      return value.msg;
    });
    error.data = errorsMsg;
    throw { error };
  }

  const email = req.body.email;
  const password = req.body.password;

  let loaduser;
  User.findOne({where : {email : email}})
    .then(user => {
      if (!user) {
        const error = new Error("User not found. Please signup.");
        res.redirect('/signup')
      }
      loaduser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isMatch => {
      if (!isMatch) {
        const error = new Error("Wrong email or password.");
        res.redirect('/login');
      } else {
        return jwt.sign(
          {
            _id: loaduser._id,
            name : loaduser.name
          },
          jwtSecret,
          { expiresIn: "1d" }
        );
      }
    })
    .then(token => {
      res.cookie("jwt", token);
      res.redirect("/chat");
    })
    .catch(err => {
      next(err);
    });
};

module.exports.getSignup = (req, res, next)=>{
    res.render('login-signup', {pageTitle : "Signup", path : "\signup"})
}

module.exports.postSignup = (req, res, next) => {
  const errors = validationResult(req).errors;
  if (errors.length > 0) {
    const error = new Error("Validation failed");
    error.statusCode = 400;
    errorsMsg = errors.map(function(value) {
      return value.msg;
    });
    error.data = errorsMsg;
    throw { error };
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  const encPass = bcrypt.hashSync(password, 12);

  User.create({ email: email, password: encPass, name: name })
    .then(user => {
      res.redirect("/login");
    })
    .catch(err => {
      next(err);
    });
};
