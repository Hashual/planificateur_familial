import { makeHandler } from "express-ts-handler";
import { z, ZodSchema } from "zod";

export const handler = makeHandler<ZodSchema>({
	parse: (type, value) => type.parse(value),
	object: z.object,
});