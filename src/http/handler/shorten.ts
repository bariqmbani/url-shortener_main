import { Request, Response } from "express";
import urlKeyProducer from "../../mq/url-key-producer";
import { clients } from "../../connected-clients";

export const shorten = async (req: Request, res: Response) => {
  const url = req.body && req.body.url ? req.body.url : "https://youtube.com";
  const client = req.body && req.body.client ? req.body.client : "test-client";

  urlKeyProducer(client);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  clients.set(client, { res, url });

  res.on("close", () => {
    clients.delete(client);
    res.end();
  });
};
