import { Request } from "express";
import HttpError from "../../utils/exceptions/HttpError";
import { StatusCodes } from "http-status-codes";
import { isInFamily } from "../../models/families/members";
import { familyCodeMiddleware } from "./familyCodeMiddleware";

export const joinFamilyMiddleware = async (req: Request) => {
	const newReq = await familyCodeMiddleware(req);

	const { family, user } = newReq;

	if (await isInFamily(family, user)) {
		throw new HttpError(StatusCodes.CONFLICT, 'User is already in the family');
	}

	return newReq;
}