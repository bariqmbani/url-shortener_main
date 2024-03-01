import amqp, { Channel, Connection } from "amqplib";
import dotenv from "dotenv";

dotenv.config();

export default class RabbitMQ {
  connection!: Connection;
  channel!: Channel;
  private connected!: Boolean;

  async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      console.info("Connecting to Rabbit-MQ Server...");
      this.connection = await amqp.connect(process.env.RABBITMQ_URI!);

      console.info("Rabbit MQ Connection is ready!");

      this.channel = await this.connection.createChannel();

      console.info("Created RabbitMQ Channel successfully!");
    } catch (error) {
      console.error(error);
      console.error("Not connected to MQ Server");
    }
  }

  async sendToQueue<MessageType>(queue: string, message: MessageType) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async consume<MessageType extends object>(queue: string, handleIncomingNotification: (msg: MessageType) => any) {
    if (!this.channel) {
      await this.connect();
    }

    await this.channel.assertQueue(queue);

    this.channel.consume(
      queue,
      (msg) => {
        {
          if (!msg) {
            return console.error(`Invalid incoming message`);
          }
          handleIncomingNotification(JSON.parse(msg.content.toString() as string) as MessageType);
          this.channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  }
}
