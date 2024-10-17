import { CRLF } from "@/constants";
import { HttpBadRequest } from "../errors/bad-request";
import { type HttpVersion } from "../utils/version";
import { parseRequestLine } from "./request-line";
import type { DynBuffer } from "@/data-structures/dynamic-buffer";
import type { HttpMethod } from "./method";

/**
 * A request line begins with a method token, followed by a single space, the request-target, another single space, the protocol version, and ends with CRLF
 */

export class HttpRequest {
	method: HttpMethod;
	version: HttpVersion;
	url: URL;
	headers: Map<string, string> = new Map();
	constructor(req: DynBuffer) {
		const reqLine = req.stripStart(CRLF);

		const reqLineObj = parseRequestLine(reqLine);
		this.method = reqLineObj.method;
		this.version = reqLineObj.version;

		let header = req.stripStart(CRLF);

		while (header) {
			if (header.compare("") === 0) {
				break;
			}
			this.parseHeader(header);

			header = req.stripStart(CRLF);
		}

		this.url = this.getUrl(reqLineObj.url);
	}

	private getUrl(url: string): URL {
		const host = this.headers.get("host");

		if (!host) {
			throw new HttpBadRequest("Host header not found");
		}

		return new URL(url, `http://${host}`);
	}

	private parseHeader(header: DynBuffer) {
		const delimiter = ":";
		// Key is case-insensitive
		const key = header.stripStart(delimiter)?.toString().toLowerCase();
		// value can be surrounded by optional white space.
		const value = header.toString().trim();

		if (!key) {
			return;
		}

		if (/\s$/g.test(key)) {
			throw new HttpBadRequest(
				"No whitespace allowed between header name and colon",
			);
		}

		/**
		 * @ignore
		 * TODO: Need to the "Set-Cookie" header field
		 * since it can come more than once.
		 */

		// Check if header already exists
		if (this.headers.has(key)) {
			// Host header cannot come more than twice
			if (key === "host") {
				throw new HttpBadRequest("Host header sent more than once");
			}

			// else combine the field values, separated by a comma.
			const prevValue = this.headers.get(key);
			this.headers.set(key, `${prevValue}, ${value}`);
		}

		this.headers.set(key, value);
	}
}
