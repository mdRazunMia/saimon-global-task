const mongoose = require("mongoose");
require("dotenv").config();
const uri = `${process.env.MONGO_BASE_URL}${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m4mbh.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then()
  .catch((error) => console.log(error));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("MongoDb has been connected successfully.");
  redisDb();
});

//redis
function redisDb() {
  const redisClient = require("./redis/redis");
  redisClient
    .redisConnectAndGetTheInstance()
    .then((res) => {
      console.log("Redis database connect successfully");
      expressApp();
    })
    .catch((error) => console.log("Redis database is not connected.", error));
}

function expressApp() {
  const express = require("express");
  const cors = require("cors");
  require("dotenv").config();
  const packageRoute = require("./routes/api_routes");
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/packages", packageRoute);
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`saimon global server is running on port: ${process.env.PORT}`);
  });
}
