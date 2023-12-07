import express, { Request, Response, Application } from "express";
import cors from "cors";
import mongoose from "mongoose";

class App {
  public express: Application;
  public port: number;

  constructor(port: number) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddlewares();
    this.initializeBaseURL();
  }

  private initializeMiddlewares(): void {
    this.express.use(cors());
    this.express.use(express.json());
  }

  private initializeDatabaseConnection(): void {
    mongoose
      .connect(String(process.env.DATABASE_URL))
      .then(() => console.log("Database connected successfully"));
  }

  private initializeBaseURL(): any {
    this.express.get("/", (req: Request, res: Response) => {
      res.status(200).send({
        status: "success",
        message: "Welcome to user service"
      });
    });
  }

  public listen() {
    this.express.listen(this.port, () =>
      console.log(`User service is running on port: ${this.port}`)
    );
  }
}

export default App;
