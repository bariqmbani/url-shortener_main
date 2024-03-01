import { clients } from "../connected-clients";
import { Entry } from "../db/schema/Entry";
import RabbitMQ from "./RabbitMQ";

const mq = new RabbitMQ();

type ShortenUrlResponse = {
  client: string;
  key: string;
};

export default async () => {
  await mq.consume<ShortenUrlResponse>(process.env.SHORTEN_URL_RES_EXCHANGE || "res", async (msg) => {
    console.log({ msg });
    const client = clients.get(msg.client);
    if (!client) return;

    clients.delete(msg.client);
    client.res.write(`${process.env.BASE_URL!}/${msg.key}`);
    client.res.end();

    await Entry.create({ key: msg.key, url: client.url });
  });
};
