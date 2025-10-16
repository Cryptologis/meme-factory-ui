export function encodeFixedString(str: string, len: number): Uint8Array {
  const buf = new Uint8Array(len);
  const strBytes = Buffer.from(str, "utf8");
  buf.set(strBytes.slice(0, len));
  return buf;
}

export function decodeFixedString(arr: number[] | Uint8Array): string {
  return Buffer.from(arr).toString("utf8").replace(/\0/g, "");
}