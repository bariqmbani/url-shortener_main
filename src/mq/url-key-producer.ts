import RabbitMQ from "./RabbitMQ";

const mq = new RabbitMQ();

export default async (client: string) => {
  await mq.sendToQueue<string>(process.env.SHORTEN_URL_REQ_EXCHANGE || "req", client);
};
