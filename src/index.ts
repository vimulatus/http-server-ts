import { TCPListener } from "./tcp/server";
import { serve } from "./servers/echo";

const server = new TCPListener();

server.listen();

while (true) {
  console.log("Waiting for connection...")
	const socket = await server.accept();
  serve(socket);
}
