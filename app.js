const express = require("express");
const app = express();

const Config = require("./utils/config");
new Config(app);

const isAuth = require("./middleware/isAuth").isAuth;
app.get("/", (req, res, next) => {
  res.render("index");
});

const auth = require("./routes/auth");
app.use(auth);

const chat = require("./routes/chat");
app.use("/chat", chat);

app.use((req, res, next) => {
  res.status(404).render("404Page");
});

const sequelize = require("./utils/database");
sequelize.sync().then(() => {
  const httpServer = app.listen(3000, () => {
    console.log("Server has started.");
  });
  const io = require("./socket").init(httpServer);
  const SocketConfig = require("./utils/socketConfig");
  new SocketConfig(io);
});
