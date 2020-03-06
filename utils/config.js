class Config {
  constructor(app) {
    // const session = require("express-session");
    // app.use(
    //   session({
    //     secret: "skljefsfsfsfdsfssdfsdfsjlkdfljksfjksdfjkls",
    //     saveUninitialized: false,
    //     resave: false
    //   })
    // );
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());

    const bodyParser = require("body-parser");
    app.use(bodyParser.urlencoded({ extended: false }));

    const express = require('express');
    app.use(express.static(__dirname + "/public"));
    
    app.set("view engine", "ejs");
  }
}

module.exports = Config;
