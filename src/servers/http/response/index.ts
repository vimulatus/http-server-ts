export class HttpResponse {
	private statusline = "HTTP/1.1 ${status} ${message}";
	constructor() {}

	status(code: number) {
		this.statusline = this.statusline.replace("${status}", code.toString());

		return this;
	}
}
