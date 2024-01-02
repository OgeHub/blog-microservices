import express, { Request, Response, Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import Controller from "./utils/interfaces/controller.interface";
import ErrorMiddleware from "./middlewares/error.middleware";

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeBaseURL();
    this.initializeErrorMiddleware();
  }

  private initializeMiddlewares(): void {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
  }

  private initializeDatabaseConnection(): void {
    mongoose
      .connect(String(process.env.DATABASE_URL))
      .then(() => console.log("Database connected successfully"));
  }

  private initializeBaseURL(): any {
    this.express.get("/api", (req: Request, res: Response) => {
      res.status(200).send({
        status: "success",
        message: "Welcome to user service"
      });
    });
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use("/api/v1", controller.router);
    });
  }

  private initializeErrorMiddleware(): void {
    this.express.use(ErrorMiddleware);
  }

  public listen() {
    this.express.listen(this.port, () =>
      console.log(`User service is running on port: ${this.port}`)
    );
  }
}

export default App;
