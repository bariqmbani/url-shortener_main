import { Request, Response } from "express";
import url from "url";
import urlKeyProducer from "../../mq/url-key-producer";
import { clients } from "../../connected-clients";
import { verifyRecaptcha } from "../recaptcha";
import { extractDomainFromUrl, isValidUrl } from "../../utils/url.util";

interface ShortenReqBody {
  url: string;
  captcha: string;
}

export const shorten = async (req: Request, res: Response) => {
  const body = req.body as ShortenReqBody;

  if (!body || !body.captcha || !body.url) {
    res.status(400).write("invalid-request");
    res.end();
    return;
  }

  const domain = extractDomainFromUrl(body.url);
  if ("localhost" === domain || "127.0.0.1" === domain || process.env.BASE_URL! === domain || !isValidUrl(body.url)) {
    res.status(400).write("invalid-url");
    res.end();
    return;
  }

  const client = body.captcha.slice(0, 12) + body.captcha.slice(-12);

  const isValidRecapthca = await verifyRecaptcha(body.captcha);
  if (!isValidRecapthca) {
    res.status(400).write("invalid-captcha");
    res.end();
    return;
  }

  urlKeyProducer(client);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  clients.set(client, {
    res,
    url: !body.url.startsWith("http://") && !body.url.startsWith("https://") ? `http://${body.url}` : body.url,
  });

  res.on("close", () => {
    console.log("client closed");
    clients.delete(client);
    res.end();
  });
};
