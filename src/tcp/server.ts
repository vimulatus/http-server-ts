import { type Server, createServer } from "net";
import { TCPConn } from "./connection";

/**
 * A server creates a socket, attaches it to a network port address, and then waits for the client to contact it.
 */
export class TCPListener {
	private server: Server;
	private listener: null | {
		resolve: (conn: TCPConn) => void;
		reject: (reason: Error) => void;
	} = null;
	private error: null | Error = null;
	private closed: boolean = false;

	constructor() {
		this.server = createServer({
			/**
			 * Since the `data` event is paused until we read the socket, the socket should be paused by default after it is created!
			 */
			pauseOnConnect: true,
		});

		this.server.on("error", (err: Error) => {
			this.error = err;

      console.error(err);

			if (this.listener) {
				this.listener.reject(err);
				this.listener = null;
			}
		});

		this.server.on("close", () => {
			this.closed = true;

      console.log("Server closed.")

			if (this.listener) {
				this.listener.reject(new Error("Server is not listening"));
				this.listener = null;
			}
		});

		this.server.on("connection", (socket) => {
			// Need to create connection only when asked for it.
			console.assert(this.listener, "Accept has not been called yet");

			console.log("Client connected!");
			const conn = new TCPConn(socket);

			this.listener!.resolve(conn);

			this.listener = null;
		});
	}

	listen(port?: number, host?: string) {
		this.server.listen(
			{
				host: host || "127.0.0.1",
				port: port || 1234,
			},
			() => {
				console.log(`Server is listening on port ${port || 1234}`);
			},
		);
	}

	async accept(): Promise<TCPConn> {
    console.assert(!this.listener, "Accepting connections while listener is still active");
		return new Promise((resolve, reject) => {
			if (this.error) {
				reject(this.error);
				return;
			}

			if (this.closed) {
				reject("Server is not listening");
				return;
			}

      this.listener = { resolve, reject };
		});
	}
}
