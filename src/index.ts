import { TCPListener } from "./tcp/server";
import type { TCPConn } from "./tcp/connection";

const server = new TCPListener();

server.listen();

async function newConn(socket: TCPConn) {
  while (true) {
    if (socket.ended) {
      console.log("Client disconnected!")
      break;
    }
    const data = await socket.read();

    if (!data) {
      break;
    }

		await socket.write(Buffer.concat([Buffer.from("Echo: "), data]));
  }
}

while (true) {
  console.log("Waiting for connection...")
	const socket = await server.accept();
  newConn(socket);
}
