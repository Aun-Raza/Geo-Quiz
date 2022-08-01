import express from "express";
import "express-async-errors";
import router from "./src/routes/route";
import MongoDB from "./config/connect";
import { transports } from "winston";
import config from "config";
import log from "./src/log/logger";

let { NODE_ENV } = process.env;
NODE_ENV = "test";

const console = new transports.Console();

if (NODE_ENV === "test") {
    console.silent = true;
    log.add(console);
} else if (NODE_ENV === "development") {
    MongoDB();
    log.add(console);
}

const app = express();

process.on("uncaughtException", (error) => {
    log.error(error.message, { service: "uncaughtException" });
    process.exit(1);
});

process.on("unhandledRejection", (error: Error) => {
    log.error(error.message, { service: "unhandledRejection" });
    process.exit(1);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

const PORT = config.get("PORT");
const server = app.listen(PORT, () => {
    log.info(`App listening on port: ${PORT}`, { service: "App" });
});

export default server;