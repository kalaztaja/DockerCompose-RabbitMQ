var amqp = require("amqplib/callback_api");

amqp.connect("amqp://rabbitmq", function (error0, connection) {
  try {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = "my.o";

      channel.assertExchange(exchange, "fanout", {
        durable: false,
      });
      setTimeout(() => {
        channel.publish("my.o", "", Buffer.from("MSG_1"));
      }, 3000);
      setTimeout(() => {
        channel.publish("my.o", "", Buffer.from("MSG_2"));
      }, 6000);
      setTimeout(() => {
        channel.publish("my.o", "", Buffer.from("MSG_3"));
      }, 9000);
    });
  } catch (error) {
    console.log(error);
  }
});
