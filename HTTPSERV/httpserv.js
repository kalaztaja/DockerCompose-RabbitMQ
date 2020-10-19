var express = require("express");
var fs = require("fs");
var app = express();

app.get("/", function (req, res) {
  fs.readFile("/data/obslogs.txt", (err, data) => {
    if (err) {
      res.send("");
    } else {
      res.attachment("obslogs.txt");
      res.type("txt");
      res.send(data);
    }
  });
});

app.listen(80, function () {
  console.log("express server listening on port 80");
});
