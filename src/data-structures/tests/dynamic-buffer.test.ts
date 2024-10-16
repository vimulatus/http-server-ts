import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { DynBuffer } from "../dynamic-buffer";

describe("Initialising a Dynamic Buffer", () => {
	test("Can be initialised without any data", () => {
		const dynBuf = new DynBuffer();
		const buf = Buffer.alloc(0);

		expect(dynBuf.data).toEqual(buf);
		expect(dynBuf.length).toBe(0);
	});

	test("Can be initialised with a Buffer", () => {
		const buf = Buffer.from("Hello");
		const dynBuf = new DynBuffer(buf);

		expect(dynBuf.data).toEqual(buf);
		expect(dynBuf.length).toEqual(buf.length);
	});

	test("Can be initialised with a string", () => {
		const str = "Hello";
		const dynBuf = new DynBuffer(str);

		expect(dynBuf.toString()).toEqual(str);
		expect(dynBuf.length).toEqual(str.length);
	});
});

test("Pushing a Buffer", () => {
	const dynBuf = new DynBuffer("Hello, ");
	const buf = Buffer.from("World");

	dynBuf.push(buf);

	expect(dynBuf.length).toEqual(12);
	expect(dynBuf.data).toEqual(Buffer.from("Hello, World"));
});

test("Pushing a Dynamic Buffer", () => {
	const buf = new DynBuffer("World");
	const dynBuf = new DynBuffer("Hello, ");

	dynBuf.push(buf);

	expect(dynBuf.data).toEqual(Buffer.from("Hello, World"));

	expect(dynBuf.length).toEqual(12);
});

test("Pushing a string", () => {
	const str = "World";
	const dynBuf = new DynBuffer("Hello, ");

	dynBuf.push(str);

	expect(dynBuf.data).toEqual(Buffer.from("Hello, World"));

	expect(dynBuf.length).toEqual(12);
});

describe("Inserting a Buffer in the beginning", () => {
	const buf = Buffer.from("Hello, ");
	const dynBuf = new DynBuffer("World");

	beforeAll(() => {
		dynBuf.insertStart(buf);
	});

	test(" 'Hello, ' + 'World' = 'Hello, World'", () => {
		expect(dynBuf.toString()).toEqual("Hello, World");
	});

	test(" 'Hello, World'.length = 12 ", () => {
		expect(dynBuf.length).toEqual(12);
	});
});

describe("Inserting a Dynamic Buffer in the beginning", () => {
	const buf = new DynBuffer("Hello, ");
	const dynBuf = new DynBuffer("World");

	beforeAll(() => {
		dynBuf.insertStart(buf);
	});

	test(" 'Hello, ' + 'World' = 'Hello, World'", () => {
		expect(dynBuf.toString()).toEqual("Hello, World");
	});

	test(" 'Hello, World'.length = 12 ", () => {
		expect(dynBuf.length).toEqual(12);
	});
});

describe("Inserting a string in the beginning", () => {
	const str = "Hello, ";
	const dynBuf = new DynBuffer("World");

	beforeAll(() => {
		dynBuf.insertStart(str);
	});

	test(" 'Hello, ' + 'World' = 'Hello, World'", () => {
		expect(dynBuf.toString()).toEqual("Hello, World");
	});

	test(" 'Hello, World'.length = 12 ", () => {
		expect(dynBuf.length).toEqual(12);
	});
});

describe("Remove", () => {
	test("Should remove bytes in a range (excluding end)", () => {
		const dynBuf = new DynBuffer("Hello");
		dynBuf.remove(1, 3);

		expect(dynBuf.toString()).toEqual("Hlo");
		expect(dynBuf.length).toBe(3);
	});

	test("If only one index passed, should remove everything after", () => {
		const dynBuf = new DynBuffer("Hello");
		dynBuf.remove(1);

		expect(dynBuf.toString()).toEqual("H");

		expect(dynBuf.length).toBe(1);
	});

	test("If start > length, should not remove anything", () => {
		const dynBuf = new DynBuffer("Hello");
		dynBuf.remove(6);
		expect(dynBuf.toString()).toEqual("Hello");
	});

	test("If nothing passed, should remove everything", () => {
		const dynBuf = new DynBuffer("Hello");
		dynBuf.remove();

		expect(dynBuf.data).toEqual(Buffer.alloc(0));
	});

	test("If end > length / 2, should not leak", () => {
		const dynBuf = new DynBuffer();
		dynBuf.push("Hello");

		dynBuf.remove(0, 4);

		expect(dynBuf.data).toEqual(Buffer.from("o"));
	});
});

describe("subarray", () => {
	test("Should return a new DynBuffer", () => {
		const dynBuf = new DynBuffer("Hello, World");
		const newBuf = dynBuf.subarray(0, 5);
		dynBuf.remove(0, 5);

		expect(dynBuf.subarray(0, 5).toString()).not.toEqual("Hello");
		expect(newBuf.toString()).toEqual("Hello");
	});

	test("Should copy bytes in a range (including end)", () => {
		const dynBuf = new DynBuffer("Hello, World");
		const buf = dynBuf.subarray(0, 5);

		expect(buf.toString()).toEqual("Hello");
		expect(buf.length);
	});
});

describe("Strip from start", () => {
	test("Should strip Hello from Hello World excluding the space", () => {
		const dynBuf = new DynBuffer("Hello World");
		const buf = dynBuf.stripStart(" ");

		expect(buf).not.toBeNull();
		expect(buf?.toString()).toEqual("Hello");
		expect(dynBuf.toString()).toEqual("World");
	});

	test("Should strip Hello from Hello World including the space", () => {
		const dynBuf = new DynBuffer("Hello World");
		const buf = dynBuf.stripStart(" ", true);

		expect(buf).not.toBeNull();
		expect(buf?.toString()).toEqual("Hello ");
		expect(dynBuf.toString()).toEqual("World");
	});

	test("Should return null if string does not exist", () => {
		const dynBuf = new DynBuffer("Hello");
		const buf = dynBuf.stripStart(" ");

		expect(buf).toBeNull();
	});
});

describe("Strip from end", () => {
	test("Should strip World from Hello World excluding the space", () => {
		const dynBuf = new DynBuffer("Hello World");
		const buf = dynBuf.stripEnd(" ");

		expect(buf).not.toBeNull();
		expect(buf?.toString()).toEqual("World");
		expect(dynBuf.toString()).toEqual("Hello");
	});

	test("Should strip World from Hello World including the space", () => {
		const dynBuf = new DynBuffer("Hello World");
		const buf = dynBuf.stripEnd(" ", true);

		expect(buf).not.toBeNull();
		expect(buf?.toString()).toEqual(" World");
		expect(dynBuf.toString()).toEqual("Hello");
	});

	test("Should return null if string does not exist", () => {
		const dynBuf = new DynBuffer("Hello");
		const buf = dynBuf.stripEnd(" ");

		expect(buf).toBeNull();
	});
});
