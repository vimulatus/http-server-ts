import { stripBuffer } from "@/utils/stripBuffer";
import { httpMethods, HttpMethods } from "./method";
import { CRLF, SP } from "@/constants";
import { HttpBadRequest } from "../errors/bad-request";

/**
 * A request line begins with a method token, followed by a single space, the request-target, another single space, the protocol version, and ends with CRLF
 */

export class HttpRequest {
  method: HttpMethods;
  uri: URL;

  constructor(req: Buffer) {
    // req contains request line as well as headers
    const reqLine = stripBuffer(req, CRLF);

    if (!reqLine) {
      throw new HttpBadRequest("Request Line is null!");
    }

    this.parseRequestLine(reqLine);
  }

  /**
   * request-line = method SP request-target SP HTTP-version CRLF
   */
  private parseRequestLine(buf: Buffer) {
    this.setMethod(stripBuffer(buf, SP));
  }

  private setMethod(method: null | Buffer) {
    if (!method) {
      throw new HttpBadRequest("Method is null");
    }

    const methodStr = method.toString();
  }
}
