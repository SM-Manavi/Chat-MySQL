const path = require('path');
const Sequelize = require("sequelize").Sequelize;
const sequelize = new Sequelize("mydb", "root", "***", {
  dialect: "mysql",
  host: "localhost"
});

sequelize.authenticate().then(()=>{
  console.log("Connected to the database.");
});
const userPath = path.join(__dirname + "/../models/user")
const User = sequelize.import(userPath);
module.exports = sequelize;
