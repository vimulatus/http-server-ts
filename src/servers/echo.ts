import { CRLF } from "@/constants";
import { DynBuffer } from "@/data-structures/dynamic-buffer";
import type { TCPConn } from "@/tcp/connection";

/**
 * The echo server consists of messages separated by `\n` (the newline character).
 * The server reads messages and sends back replies using the same protocol:
 *  * If the client sends `quit`, reply with `Bye.`, and close the connection.
 *  * Otherwise, echo the message back with the prefix 'Echo: '
 */
export async function serve(conn: TCPConn): Promise<void> {
	const buf = new DynBuffer();

	while (true) {
		console.log(buf.data);
		const msg: null | DynBuffer = buf.stripStart(CRLF, true);
		if (!msg) {
			console.log("Waiting to read...");
			const data: DynBuffer = await conn.read();
			buf.push(data);

			if (data.length === 0) {
				return;
			}

			continue;
		}

		if (msg.data.equals(Buffer.from("quit\n"))) {
			await conn.write(new DynBuffer("Bye.\n"));
			conn.destroy();
			return;
		}
		const reply = msg;
		reply.insertStart("Echo: ");

		await conn.write(reply);
	}
}
