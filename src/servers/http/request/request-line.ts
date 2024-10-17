import { getHttpVersion, type HttpVersion } from "../utils/version";
import { getMethod, type HttpMethod } from "./method";
import { SP } from "@/constants";
import { HttpBadRequest } from "../errors/bad-request";
import type { DynBuffer } from "@/data-structures/dynamic-buffer";

/**
 * request-line = method SP request-target SP HTTP-version
 */
export function parseRequestLine(buf: DynBuffer | null): {
	method: HttpMethod;
	url: string;
	version: HttpVersion;
} {
	if (!buf) {
		throw new HttpBadRequest("Request Line is Null");
	}

	// Step 1: Extract the method
	const method = getMethod(buf.stripStart(SP));

	// Step 2: Extract the Base URI
	const url = getUrl(buf.stripStart(SP));

	// Step 3: Extract the version
	const version = getHttpVersion(buf);

	return {
		method,
		url,
		version,
	};
}

function getUrl(uri: null | DynBuffer) {
	if (!uri) {
		throw new HttpBadRequest("uri is null");
	}

	const uriStr = uri.toString();

	return uriStr;
}
