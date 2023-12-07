import "dotenv/config";
import App from "./app";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App(Number(process.env.PORT));

app.listen();
