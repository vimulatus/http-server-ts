import { DynBuffer } from "@/data-structures/dynamic-buffer";
import type { TCPConn } from "@/tcp/connection";
import { TCPListener } from "@/tcp/server";
import { HttpError } from "./errors";
import { HttpErrorCodes } from "./errors/codes";

export class HttpServer {
	private tcpListener: TCPListener;

	constructor() {
		this.tcpListener = new TCPListener();
	}

	/**
	 * Starts the server
	 * @default port 1234
	 * @default host 127.0.0.1 (localhost)
	 */
	async start(port?: number, host?: string) {
		this.tcpListener.listen(port, host);

		while (true) {
			console.log("Waiting for connection...");
			const conn = await this.tcpListener.accept();
			this.serve(conn);
		}
	}

	/**
	 * Serves the client
	 */
	private async serve(conn: TCPConn) {}
}
