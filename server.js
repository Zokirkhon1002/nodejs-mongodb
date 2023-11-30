const express = require("express");
const dotenv = require("dotenv");
const connectToMongoDB = require("./config/db");
const helmet = require("helmet");
const compression = require("compression");

class Server {
  constructor() {
    this.app = express();
    this.setupEnvironment();
  }

  setupEnvironment() {
    dotenv.config();
    this.port = process.env.PORT || 4000;
    this.connectToDBAndConfigureExpress();
  }

  connectToDBAndConfigureExpress() {
    connectToMongoDB();
    this.configureExpress();
  }

  configureExpress() {
    this.app.use(express.json());
    this.setupRoutes();
    this.setupNotFoundRoute();
    this.startServer();
  }

  setupRoutes() {
    this.app.get("/", require("./controller/mainTest"));
    this.app.use("/api", require("./routes"));
  }

  setupNotFoundRoute() {
    this.app.all("/*", require("./controller/notFount404"));
  }

  startServer() {
    this.app.use(helmet());
    this.app.use(compression());
    this.app.listen(this.port, () => {
      console.log(`Server is running on port: ${this.port}`);
    });
  }
}

new Server();
