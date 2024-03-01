import express from "express";
import cors from "cors";
import { redirect, shorten } from "./handler";

const app = express();
app.use(cors());
app.use(express.json());
app.disable("x-powered-by");

app.get("/:key", redirect);

app.post("/api/v1/shorten", shorten);
app.get("/api/v1/shorten", shorten);

export const startHttpServer = async () => {
  const port = process.env.HTTP_PORT || 4000;
  app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
  });
};
