import { z } from "zod";

export const httpMethods = z.enum(["GET", "POST", "DELETE", "PUT", "OPTIONS"]);

export type HttpMethods = z.infer<typeof httpMethods>;
