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
	private _data: Buffer;
	length: number;

	get data() {
		return this._data.subarray(0, this.length);
	}

	constructor(value?: Buffer | string) {
		if (typeof value === "string") {
			this._data = Buffer.from(value);
			this.length = this._data.length;
		} else if (value === undefined) {
			this._data = Buffer.alloc(0);
			this.length = 0;
		} else {
			this._data = value;
			this.length = value.length;
		}
	}

	push(value: Buffer | DynBuffer | string) {
		const newLen = this.length + value.length;

		if (newLen > this._data.length) {
			// Increase the buffer size
			const len = Math.max(this._data.length * 2, 32);

			const newBuf = Buffer.alloc(len);

			// copy data of prev buf to new buf
			this._data.copy(newBuf);

			// set new buf as this buf.
			this._data = newBuf;
		}

		if (value instanceof DynBuffer) {
			value._data.copy(this._data, this.length);
		} else if (typeof value === "string") {
			const buf = Buffer.from(value);
			buf.copy(this._data, this.length);
		} else {
			value.copy(this._data, this.length);
		}
		this.length = newLen;
	}

	insertStart(value: Buffer | DynBuffer | string) {
		const newLen = value.length + this.length;

		if (newLen > this._data.length) {
			// Increase the buffer size
			const len = Math.max(this._data.length * 2, 32);

			const newBuf = Buffer.alloc(len);

			this._data.copy(newBuf);

			this._data = newBuf;
		}

		this._data.copyWithin(value.length, 0);
		if (value instanceof DynBuffer) {
			value.data.copy(this._data);
		} else if (typeof value === "string") {
			const buf = Buffer.from(value);
			buf.copy(this._data);
		} else {
			value.copy(this._data);
		}
		this.length = newLen;
	}

	remove(start = 0, _end?: number) {
		const end = Math.min(_end || this.length, this.length);

		this._data.copyWithin(start, end);

		this.length -= end - start;

		// prevent leakage
		Buffer.alloc(this._data.length).copy(this._data, this.length);
	}

	subarray(start?: number, end?: number) {
		const newBuf = Buffer.from(this._data.subarray(start, end));

		return new DynBuffer(newBuf);
	}

	stripStart(till: string, inclusive = false): DynBuffer | null {
		// get the index of till
		const i = this._data.indexOf(till);
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
		const i = this._data.lastIndexOf(from);

		if (i < 0) {
			return null;
		}

		const newBuf = inclusive ? this.subarray(i) : this.subarray(i + 1);

		// remove the last len - i bytes from the current buffer
		this.remove(i);

		return newBuf;
	}
}
