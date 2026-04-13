import "dotenv/config";
import { broker } from "./config/broker";

async function start() {
  broker.createService((await import("./services/api.service")).default);
  broker.createService((await import("./services/auth.service")).default);
  broker.createService((await import("./services/product.service")).default);
  await broker.start();
}

start();