import { HttpError } from ".";
import { HttpErrorCodes } from "./codes";

export class HttpBadRequest extends HttpError {
  constructor(message: string) {
    super(HttpErrorCodes.BadRequest, message);
  }
}
