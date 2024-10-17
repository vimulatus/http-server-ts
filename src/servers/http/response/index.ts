import type { HttpVersion } from "../utils/version";

export class HttpResponse {
	version: HttpVersion;
	code: number = 200;
	private headers: Record<string, string | string[]> = {};
	constructor(version: HttpVersion) {
		this.version = version;
	}

	status(code: number) {
		if (code < 100 || code >= 600) {
			throw new Error("Invalid Status Code");
		}

		this.code = code;
	}

	send(msg: unknown) {}

	setHeader(name: string, value: string | string[]) {
		this.headers[name] = value;

		return this;
	}

	hasHeader(name: string) {
		const val = this.headers[name];

		return !!val;
	}

	getHeader(name: string) {
		return this.headers[name];
	}

	getHeaders() {
		return this.headers;
	}

	getHeaderNames() {
		return Object.keys(this.headers);
	}
}
