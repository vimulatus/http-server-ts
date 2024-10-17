import { z } from "zod";
import { HttpError } from "../errors";
import { HttpErrorCodes } from "../errors/codes";
import { HttpBadRequest } from "../errors/bad-request";
import type { DynBuffer } from "@/data-structures/dynamic-buffer";
const HTTP_VER_REGEX = /^HTTP\/(\d\.\d)$/;

const httpVersionSchema = z.enum(["1.0", "1.1", "2.0", "3.0"]);

export type HttpVersion = z.infer<typeof httpVersionSchema>;

export function getHttpVersion(buf: null | DynBuffer): HttpVersion {
	if (!buf) {
		throw new HttpBadRequest("Version is null");
	}
	const version = buf.toString();
	const matches = HTTP_VER_REGEX.exec(version);

	if (!matches) {
		throw new HttpError(
			HttpErrorCodes.HttpVersionNotSupported,
			`Http Version ${version} is Not Supported`,
		);
	}

	return httpVersionSchema.parse(matches[1]);
}
