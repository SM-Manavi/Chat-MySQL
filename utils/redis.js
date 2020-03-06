const creds = {
  user: "Mo",
  host: "SG-Mo-31601.servers.mongodirector.com",
  port: "6379",
  password: "uTaVay4lBK6aGD1AByhdPUrXwZaDqe7e"
};

const redis_client = require("redis").createClient(
  "redis://" +
    creds.user +
    ":" +
    creds.password +
    "@" +
    creds.host +
    ":" +
    creds.port
);
redis_client.once("connect", () => {
  console.log("Connected to redis.");
});

const User = require("../utils/database").model("user");
redis_client.findUser = function(userId) {
  var promise = new Promise((resolve, reject) => {
    redis_client.get(userId, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (data != null) {
        let user = JSON.parse(data);
        resolve(user);
      } else {
        User.findByPk(userId)
          .then(user => {
            redis.set(userId.toString(), JSON.stringify(user));
            resolve(user);
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      }
    });
  });
  return promise;
};

module.exports = redis_client;
