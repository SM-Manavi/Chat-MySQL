const User = require("../utils/database").model("user");
const redis_client = require("./redis")

class SocketConfig {
  #onlineUser;
  constructor(io) {
    const isAuth = require("../middleware/isAuth").socketAuth;
    io.use(isAuth);
    this.#connectEvent(io);
    this.#onlineUser = new Map();
  }

  #connectEvent = io => {
    io.on("connect", socket => {
      this.#userConfig(io, socket, socket.request.userId);
      this.#RegisterSendMsgEvent(socket);
      this.#socketDisconnectEvent(io, socket);
      //   this.#Notify(io);
      console.log("Client connected.");
    });
  };

  #Notify = io => {
    io.sockets.emit("onlineUser", JSON.stringify([...this.#onlineUser]));
  };

  #RegisterSendMsgEvent = socket => {
    socket.on("sendMsg", data => {
      const destUserId = data.destUserId;
      redis_client.findUser(destUserId).then(user => {
        if (!user) {
          socket.emit("merror", { msg: "User not found." });
          return;
        }
        if (user.roomName === "") {
          socket.emit("merror", { msg: "User is offline." });
          return;
        }
        console.log(user);
        socket
          .to(user.roomName)
          .emit("message", { sender: socket.request.userName, msg: data.msg });
      });
    });
  };

  #checkAuthForEeachUserPacket = socket => {
    socket.use((packet, next) => {
      if (socket.request.headers.isAuth) {
        return next();
      }
      next(new Error("Authentication faild."));
    });
  };

  #userConfig = (io, socket, userId) => {
    User.findByPk(userId)
      .then(user => {
        if (!user) {
          socket.disconnect(true);
        }
        user.roomName = user._id.toString() + user.name;
        return user.save();
      })
      .then(user => {
        socket.join(user.roomName);
        this.#onlineUser.set(user._id.toString(), user.name);
        redis_client.set(user._id.toString(), JSON.stringify(user));
        this.#Notify(io);
      })
      .catch(err => {
        console.log(err);
        socket.emit("merror", { msg: "Serve side error" });
        socket.disconnect(true);
      });
  };

  #socketDisconnectEvent = (io, socket) => {
    socket.on("disconnecting", reason => {
      console.log("Client disconnected.");
      const userId = socket.request.userId;
      User.findByPk(userId).then(user => {
        if (user) {
          var counter = io.sockets.adapter.rooms[user.roomName];
          if (!counter) {
            user.roomName = "";
            user.save();
            redis_client.set(user._id.toString(), JSON.stringify(user));
            this.#onlineUser.delete(user._id.toString());
          }
          this.#Notify(io);
        }
      });
    });
  };
}

module.exports = SocketConfig;
