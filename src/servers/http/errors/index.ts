import type { HttpErrorCodes } from "./codes";

export class HttpError extends Error {
	code: HttpErrorCodes;
	constructor(code: HttpErrorCodes, message: string) {
		super(`Http Error: ${code}\n${message}`);
		this.code = code;
		this.message = message;
		this.name = "HttpError";
	}
}
