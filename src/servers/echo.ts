import { DynBuffer } from "../data-structures/dynamic-buffer";
import type { TCPConn } from "../tcp/connection";

/**
 * The echo server consists of messages separated by `\n` (the newline character).
 * The server reads messages and sends back replies using the same protocol:
 *  * If the client sends `quit`, reply with `Bye.`, and close the connection.
 *  * Otherwise, echo the message back with the prefix 'Echo: '
 */
export async function serve(conn: TCPConn): Promise<void> {
  const buf = new DynBuffer()

  while (true) {
    console.log("buffer length: ", buf.length)
    console.log("Buffer actual length: ", buf.data.length);
    console.log("data in buf: ", buf.data.toString());
    const msg: null | Buffer = buf.stripTill("\n");
    
    if (!msg) {
      console.log("Waiting to read...")
      const data: Buffer = await conn.read();
      buf.push(data);

      if (data.length === 0) {
        return;
      }

      continue;
    }

    if (msg.equals(Buffer.from('quit\n'))) {
      await conn.write(Buffer.from("Bye.\n"));
      conn.destroy();
      return;
    } else {
      const reply = Buffer.concat([
        Buffer.from("Echo: "),
        msg
      ]);

      await conn.write(reply)
    }
  }
}
