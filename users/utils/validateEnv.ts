import { cleanEnv, str, port } from "envalid";

function validateEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "production"]
    }),
    DATABASE_URL: str(),
    PORT: port({ default: 3001 })
  });
}

export default validateEnv;
