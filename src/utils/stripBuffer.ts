export function stripBuffer(buf: Buffer, till: string) {
  const i = buf.indexOf(till);

  if (i < 0) {
    // till does not exist in buf
    return null;
  }

  const data = Buffer.from(buf.subarray(0, i + 1));

  buf.copyWithin(0, i + 1);

  return data;
}
