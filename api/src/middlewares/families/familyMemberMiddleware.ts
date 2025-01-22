import { Request } from "express";
import { familyIdMiddleware } from "./familyId.middleware";
import { getFamilyMember } from "../../models/families/members";
import HttpError from "../../utils/exceptions/HttpError";
import { StatusCodes } from "http-status-codes";
import { getUserById } from "../../models/user/user";
import { z } from "zod";

export const familyMemberMiddleware = async (req: Request) => {
	const newReq = await familyIdMiddleware(req)

	const { family } = newReq;
	const { memberId } = req.params;

	const member = await getUserById(parseInt(memberId));
	if (!member) {
		throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');
	}

	const familyMember = await getFamilyMember(family, member);
	if (!familyMember) {
		throw new HttpError(StatusCodes.NOT_FOUND, 'User not in the family');
	}

	return Object.assign(newReq, { familyMember });
}

export const FAMILY_MEMBER_ID_TYPE = z.coerce.number().int();