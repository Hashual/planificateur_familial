import { Request } from "express";
import { familyMemberMiddleware } from "./familyMemberMiddleware";
import HttpError from "../../utils/exceptions/HttpError";
import { StatusCodes } from "http-status-codes";

export const manageFamilyMemberMiddleware = async (req: Request) => {
	const newReq = await familyMemberMiddleware(req);

	const { family, user, familyMember } = newReq;

	if (family.ownerId != user.id) {
		throw new HttpError(StatusCodes.FORBIDDEN, "You are not the owner of the family");
	}

	return Object.assign(newReq, { familyMember });
}