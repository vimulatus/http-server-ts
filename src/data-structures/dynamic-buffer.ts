import { Buffer } from "node:buffer";
/**
 * A Buffer object in NodeJS is a like an array in other languages except for bytes.
 * It is a fixed-size chunk of binary data.
 * It cannot grow by appending data.
 *
 * If we need to append data to it, we need to do the following:
 * ```
 * while (need_more_data()) {
 *   buf = Buffer.concat([buf, get_some_data()]);
 * }
 * ```
 *
 * However, this operation can lead to O(n^2) tc, because each time new data is appended, the old data is copied.
 *
 * To amortize the cost of copying, dynamic arrays are used.
 */
export class DynBuffer {
	data: Buffer;
	length: number;

	constructor(value: number | Buffer | string = 0) {
		if (typeof value === "number") {
			this.data = Buffer.alloc(value);
			this.length = 0;
		} else if (typeof value === "string") {
			this.data = Buffer.from(value);
			this.length = this.data.length;
		} else {
			this.data = value;
			this.length = value.length;
		}
	}

	push(value: Buffer | DynBuffer) {
		const newLen = this.length + value.length;

		if (newLen > this.data.length) {
			// Increase the buffer size
			const len = Math.max(this.data.length * 2, 32);

			const newBuf = Buffer.alloc(len);

			// copy data of prev buf to new buf
			this.data.copy(newBuf);

			// set new buf as this buf.
			this.data = newBuf;
		}

		if (value instanceof DynBuffer) {
			value.data.copy(this.data, this.length);
		} else {
			value.copy(this.data, this.length);
		}
		this.length = newLen;
	}

	insertStart(value: Buffer) {
		const newLen = value.length + this.length;

		if (newLen > this.data.length) {
			// Increase the buffer size
			const len = Math.max(this.data.length * 2, 32);

			const newBuf = Buffer.alloc(len);

			this.data.copy(newBuf);

			this.data = newBuf;
		}

		this.data.copyWithin(value.length, 0);
		value.copy(this.data);
		this.length = newLen;
	}

	remove(start: number, _end?: number) {
		const end = Math.min(_end || this.length, this.length);

		this.data.copyWithin(start, end);

		this.length -= end - start;

		// prevent leakage
		Buffer.alloc(this.data.length).copy(this.data, this.length);
	}

	subarray(start?: number, end?: number) {
		const newBuf = Buffer.from(this.data.subarray(start, end));

		return new DynBuffer(newBuf);
	}

	stripStart(till: string, inclusive = false): DynBuffer | null {
		// get the index of till
		const i = this.data.indexOf(till);
		const n = till.length;

		if (i < 0) {
			// buf does not contain till
			return null;
		}

		const newBuf = inclusive ? this.subarray(0, i + n) : this.subarray(0, i);

		// remove the i + 1 bytes from the current buffer
		this.remove(0, i + n);

		return newBuf;
	}

	toString() {
		return this.data.toString();
	}

	stripEnd(from: string, inclusive = false): DynBuffer | null {
		// get the index of from
		const i = this.data.lastIndexOf(from);

		if (i < 0) {
			return null;
		}

		const newBuf = inclusive ? this.subarray(i) : this.subarray(i + 1);

		// remove the last len - i bytes from the current buffer
		this.remove(i);

		return newBuf;
	}
}
