#!/usr/bin/env node

var amqp = require("amqplib/callback_api");
var fs = require("fs");
var moment = require("moment");

amqp.connect("amqp://rabbitmq", function (error0, connection) {
  try {
    if (error0) {
      throw error0;
    }
    fs.truncate("/data/obslogs.txt", 0, function () {
      console.log("Cleared file");
    });
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
                try {
                  var CurrentDate = moment().toISOString();
                  var topic = msg.fields.exchange;
                  var content = msg.content.toString();
                  fs.appendFile(
                    "/data/obslogs.txt",
                    CurrentDate +
                      " Topic " +
                      topic +
                      ": " +
                      content +
                      " \r\n",
                    function (err) {
                      if (err) throw err;
                    }
                  );
                } catch (error) {
                  console.log("Error " + error);
                }
              }
            },
            {
              noAck: true,
            }
          );
        }
      );
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
          channel.bindQueue(q.queue, exchange_i, "");

          channel.consume(
            q.queue,
            function (msg) {
              if (msg.content) {
                try {
                  var CurrentDate = moment().toISOString();
                  var topic = msg.fields.exchange;
                  var content = msg.content.toString();
                  fs.appendFile(
                    "/data/obslogs.txt",
                    CurrentDate +
                      " Topic " +
                      topic +
                      ": " +
                      content +
                      " \r\n",
                    function (err) {
                      if (err) throw err;
                    }
                  );
                } catch (error) {
                  console.log("Error " + error);
                }
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
