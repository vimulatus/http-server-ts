import type { HttpMethods } from "./method";

export class HttpRequest {
	private statusline = "${METHOD} ${URL} HTTP/1.1";

	method(method: HttpMethods) {
		this.statusline.replace("${METHOD}", method);

		return this;
	}

	url(url: URL) {
		this.statusline.replace("${URL}", url.toString());

		return this;
	}
}
