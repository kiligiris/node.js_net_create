const net = require("net");
const fs = require("fs");
const server = net.createServer((socket) => {
  console.log("通信きた");

  socket.on("data", (data) => {
    console.log(data.toString());
    const d = data.toString().split("\r\n");
    const req = d[0].split(" "); //ステータスライン
    console.log(req);

    const url = "public" + req[1];
    console.log(url);

    const statusLine = "HTTP/1.1 200 OK\r\n";
    const header =
      "Host: codesandbox\r\n" +
      "Content-Type: " +
      getType(req[1]) +
      "; charset=utf-8\r\n";
    console.log(header);

    const response = statusLine + header;
    socket.write(response + "\r\n");

    if (req[0] === "GET") {
      if (fs.existsSync(url)) {
        socket.write(fs.readFileSync(url));
      } else {
        socket.write("HELLO WORLD\r\n");
      }
    } else if (req[0] === "POST") {
      const ps = d[d.length - 1]; //POST通信の際のデータ
      if (req[1] === "/janken") {
        var jan = ["グー", "チョキ", "パー"];
        var rand = Math.floor(Math.random() * 3); //0~2までの乱数
        var jsn = ps.indexOf("janken=") + 7;
        var jen = ps.indexOf("&", jsn);
        var plj = jen !== -1 ? ps.substring(jsn, jen) : (plj = ps.substr(jsn));

        plj = decodeURI(plj);

        var pln = jan.indexOf(plj); //じゃんけんの手を数字に変換

        if (rand === pln) {
          socket.write("あいこ");
        } else if (rand === (pln - 1 + 3) % 3) {
          socket.write("負け");
        } else if (rand === (pln + 1) % 3) {
          socket.write("勝ち");
        }
      } else {
        socket.write("HELLO WORLD\r\n");
      }
    }
    socket.end();
  });
});

server.listen(8080);

function getType(_url) {
  var types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "svg+xml"
  };
  for (var key in types) {
    if (_url.endsWith(key)) {
      return types[key];
    }
  }
  return "text/plain";
}
