import { z } from "zod";
import { HttpBadRequest } from "../errors/bad-request";
import { HttpError } from "../errors";
import { HttpErrorCodes } from "../errors/codes";
import type { DynBuffer } from "@/data-structures/dynamic-buffer";

export const httpMethodsSchema = z.enum(["GET", "HEAD"]);

export type HttpMethod = z.infer<typeof httpMethodsSchema>;

export function getMethod(buf: null | DynBuffer) {
	if (!buf) {
		throw new HttpBadRequest("Method is null");
	}

	const methodStr = buf.toString();

	const method = httpMethodsSchema.parse(methodStr);

	if (!method) {
		// method not implemented
		throw new HttpError(
			HttpErrorCodes.NotImplemented,
			"Method is Not Implemented",
		);
	}

	return method;
}
