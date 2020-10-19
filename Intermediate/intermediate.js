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
      var exchange_i = "my.i";

      channel.assertExchange(exchange_i, "fanout", {
        durable: false,
      });

      channel.assertQueue(
        "",
        {
          exclusive: true,
        },
        function (error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(
            " [*] Waiting for messages in %s. To exit press CTRL+C",
            q.queue
          );
          channel.bindQueue(q.queue, exchange, "");

          channel.consume(
            q.queue,
            function (msg) {
              if (msg.content) {
                setTimeout(
                  () => {
                    channel.publish(
                      exchange_i,
                      "",
                      Buffer.from("Got " + msg.content.toString())
                    );
                  },
                  1000,
                  msg
                );
              }
            },
            {
              noAck: true,
            }
          );
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
});
