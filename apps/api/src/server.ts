import app from "./app";
import { getEnv } from "./config/env";

const env = getEnv();

app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});
