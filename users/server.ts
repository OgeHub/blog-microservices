import "dotenv/config";
import validateEnv from "./utils/validateEnv";
import App from "./app";
import UserController from "./user/user.controller";

validateEnv();

const app = new App([new UserController()], Number(process.env.PORT));

app.listen();
