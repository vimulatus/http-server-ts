import * as net from "net";

const host = "127.0.0.1";
const port = 1234;

const server = net.createServer();

server.on("connection", (socket) => {
  console.log("New Connection: ", socket.remoteAddress, socket.remotePort);

  socket.on("end", () => {
    // FIN received.
    console.log("EOF.")
  })

  socket.on("data", (data) => {
    console.log('data: ', data);
    socket.write(`Received: ${data}`);

    if (data.includes('q')) {
      console.log("Closing...");
      socket.end();
    }
  })
});

server.on("error", (err) => {
  throw err;
});

server.on("listening", () => {
  console.log(`Server is listening on host: ${host} and port: ${port}`);
});

server.listen({ host, port });
