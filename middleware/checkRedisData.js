const redisInstance = require("../redis/redis");
const checkDataInRedis = (req, res, next) => {
  var client = redisInstance.getRedisClient();
  let query = req.params.search;
  client.get(query, (error, data) => {
    if (error) throw error;

    if (!data) {
      return next();
    } else {
      return res
        .status(200)
        .send({ data: JSON.parse(data), messgage: "Data from cache" });
    }
  });
};

module.exports = {
  checkDataInRedis,
};
