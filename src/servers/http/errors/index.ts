export class HttpError extends Error {
  constructor(code: number, message: string) {
    super(`Http Error: ${code}\n${message}`);
    this.name = "HttpError";
  }
}
