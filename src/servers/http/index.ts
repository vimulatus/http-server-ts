import { DynBuffer } from "@/data-structures/dynamic-buffer";
import type { TCPConn } from "@/tcp/connection";
import { TCPListener } from "@/tcp/server";
import { HttpError } from "./errors";
import { HttpErrorCodes } from "./errors/codes";
import { CRLF } from "@/constants";
import { HttpRequest } from "./request";

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
  private async serve(conn: TCPConn) {
    const buf = new DynBuffer();
    while (true) {
      const msg = buf.stripTill(`${CRLF}${CRLF}`);
      if (!msg) {
        const data = await conn.read();

        // If no data received. -> EOF
        if (data.length === 0) {
          return;
        }

        buf.push(data);

        continue;
      }

      // msg exists
      // A server only expects requests
      const request = new HttpRequest(msg);

      // If body is expected
    }
  }
}
