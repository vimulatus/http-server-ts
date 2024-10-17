import { DynBuffer } from "@/data-structures/dynamic-buffer";
import type { Socket } from "net";

/**
 * A socket is one endpoint of a two-way communication link between two programs running on the network.
 * Sockets provide bidirectional FIFO communication facility over the network.
 *
 * Each socket has a specific address which is composed of an IP address and a port number.
 *
 * A TCP Socket is a Stream socket, which provides a connection-oriented, sequenced, and unique flow of data without record boundaries with well defined mechanisms for creating and destroying connections and for detecting errors.
 */
export class TCPConn {
	private socket: Socket;
	ended: boolean = false;
	error: null | Error = null;
	private reader: null | {
		resolve: (value: DynBuffer) => void;
		reject: (reason: Error) => void;
	} = null;
	constructor(socket: Socket) {
		/**
		 * Note: Since the `data` event is paused until we read the socket, the socket should be paused by default after it is created!
		 */
		socket.on("data", (data: Buffer) => {
			// The reader must exist before the event is fired
			console.assert(this.reader, "reader must exist");

			/**
			 * The `data` event is emitted whenever data arrives, but the promise only exists when the program is reading from the socket.
			 * So we need to control when the `data` event is fired.
			 */
			socket.pause();

			this.reader!.resolve(new DynBuffer(data));

			this.reader = null;
		});

		socket.on("end", () => {
			this.ended = true;

			if (this.reader) {
				this.reader.resolve(new DynBuffer("")); // EOF
				this.reader = null;
			}
		});

		socket.on("error", (err: Error) => {
			this.error = err;
			if (this.reader) {
				this.reader.reject(err);
				this.reader = null;
			}
		});

		socket.on("connect", () => {
			console.log("Client Connected");
		});

		this.socket = socket;
	}

	async read(): Promise<DynBuffer> {
		// No concurrent reads
		console.assert(!this.reader, "no concurrent reads");

		return new Promise((resolve, reject) => {
			if (this.error) {
				reject(this.error);
				return;
			}

			if (this.ended) {
				resolve(new DynBuffer(""));
				return;
			}

			this.reader = { resolve, reject };

			// Resume the `data` event to fulfill the promise later
			this.socket.resume();
		});
	}

	async write(data: DynBuffer): Promise<void> {
		console.assert(data.length > 0);

		return new Promise((resolve, reject) => {
			if (this.error) {
				reject(this.error);
				return;
			}

			if (this.ended) {
				resolve();
				return;
			}

			this.socket.write(data.data, (err?: Error) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	setEncoding(encoding?: BufferEncoding) {
		this.socket.setEncoding(encoding);
	}

	destroy() {
		this.socket.destroy();
		this.ended = true;
	}
}
