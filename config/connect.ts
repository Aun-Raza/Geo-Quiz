import mongoose from "mongoose";
import config from "config";
import log from "../src/log";

export default async function run() {
    try {
        await mongoose.connect(config.get("DB_URI"));
        log.info("Connected to MongoDB", { service: "MongoDB" });
    } catch (error) {
        log.error(error.msg, { service: "MongoDb" });
    }
}
