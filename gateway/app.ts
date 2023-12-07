import express, { Application } from "express";
import cors from "cors";
import proxy from "express-http-proxy";

class App {
  public express: Application;
  public port: number;

  constructor(port: number) {
    this.express = express();
    this.port = port;

    this.initializeMiddleware();
  }

  private initializeMiddleware(): void {
    this.express.use(cors());
    this.express.use("/", proxy(String(process.env.POST_SERVICE)));
    this.express.use("/users", proxy(String(process.env.USER_SERVICE)));
  }

  public listen() {
    this.express.listen(this.port, () =>
      console.log(`Gateway is listening on port: ${this.port}`)
    );
  }
}

export default App;
