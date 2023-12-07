import express, { Request, Response, Application } from "express";
import cors from "cors";
import mongoose from "mongoose";

class App {
  public express: Application;
  public port: number;

  constructor(port: number) {
    this.express = express();
    this.port = port;

    this.initializeMiddleware();
    this.initializeDatabaseConnection();
    this.initializeBaseUrl();
  }

  private initializeMiddleware(): void {
    this.express.use(cors());
  }

  private initializeDatabaseConnection(): void {
    mongoose
      .connect(String(process.env.DATABASE_URL))
      .then(() => console.log("Database connected successfully"));
  }

  private initializeBaseUrl(): any {
    this.express.get("/", (req: Request, res: Response) => {
      res.status(200).send({
        status: "success",
        message: "Welcome to post service"
      });
    });
  }

  public listen() {
    this.express.listen(this.port, () =>
      console.log(`Post service listening on port: ${this.port}`)
    );
  }
}

export default App;
