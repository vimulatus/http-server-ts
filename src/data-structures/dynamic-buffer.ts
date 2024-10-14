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
	private _length: number;
  private readTill: number = 0;

	constructor(data: Buffer | number = 0) {
		if (typeof data === "number") {
			this.data = Buffer.alloc(data);
			this._length = data;
		} else {
			this.data = data;
			this._length = data.length;
		}
	}

	get length() {
		return this._length;
	}

	push(data: Buffer) {
		const newLen = this.length + data.length;

		if (this.data.length < newLen) {
			let cap = Math.max(this._length, 32);
			while (cap < newLen) {
				cap *= 2;
			}

			const grown = Buffer.alloc(cap);
			this.data.copy(grown, 0, 0);
			this.data = grown;
		}

		data.copy(this.data, this._length, 0);
		this._length = newLen;
	}

	pop(len: number): void {
		this.data.copyWithin(0, len, this._length);
		this._length -= len;
	}

	stripTill(by: string): null | Buffer {
		const i = this.data.subarray(this.readTill, this.length).indexOf(by) + this.readTill;

		if (i < 0) {
			return null;
		}

		const msg = Buffer.from(this.data.subarray(this.readTill, i + 1));

    this.readTill = i + 1

    if (this.readTill > this._length / 2) {
      this.pop(this.readTill);
      this.readTill = 0;
    }

		return msg;
	}
}
