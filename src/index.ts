import dotenv from "dotenv";
import { startHttpServer } from "./http";
import { connect } from "./db/db-connection";
import { urlKeyConsumer } from "./mq";

dotenv.config();

connect()
  .then(() => {
    console.log("MongoDB connection is ready!");
    startHttpServer();
    urlKeyConsumer();
  })
  .catch((error) => {
    console.error("Failed to connect to to MongoDb. Exiting...", error);
    process.exit(1);
  });
