const jwt = require("jsonwebtoken");
const secret = "lskflsjkdflksdlfsdlkfdkslfsdklfsdfldsflksdf";
const User = require("../utils/database").model("user");

module.exports.isAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    const error = new Error("Not Authenticated.");
    res.redirect("/login");
    return;
  }

  let decode;
  try {
    decode = jwt.verify(token, secret);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!decode) {
    const error = new Error("Not Authenticated.");
    res.redirect("/login");
    return;
  }

  User.findByPk(decode._id)
    .then(user => {
      if (!user) {
        const error = new Error("Not Authenticated.");
        res.redirect("/login");
        return;
      }
      req.user = { _id: user._id, email: user.email };
      next();
    })
    .catch(err => {
      next(err);
    });
};

module.exports.socketAuth = (socket, next) => {
    const token = socket.handshake.headers.jwt;
    let decode;
    try {
      decode = jwt.verify(token, secret);
    } catch (err) {
      return next(new Error("Authentication faild."))
    }
    if (!decode) {
      return next(new Error("Not Authenticated."));
    }
    socket.request.userId = decode._id;
    socket.request.userName = decode.name;
    next();
};
