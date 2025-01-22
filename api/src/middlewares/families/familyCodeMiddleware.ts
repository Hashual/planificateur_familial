import { Request } from "express";
import { isConnectedMiddleware } from "../auth/isConnected.middleware";
import { getFamilyByCode } from "../../models/families/family";
import HttpError from "../../utils/exceptions/HttpError";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { FAMILY_JOIN_CODE_LENGTH } from "../../constants/families";
import { isInFamily } from "../../models/families/members";

export const familyCodeMiddleware = async (req: Request) => {
	const newReq = await isConnectedMiddleware(req);

	const { user } = newReq;
	const { code } = newReq.body;

	const family = await getFamilyByCode(code);

	if (!family) {
		throw new HttpError(StatusCodes.NOT_FOUND, 'Family not found');
	}

	// TODO: Extract this check to a separate middleware
	if (await isInFamily(family, user)) {
		throw new HttpError(StatusCodes.CONFLICT, 'User is already in the family');
	}

	return Object.assign(newReq, { family });
}

export const FAMILY_CODE_TYPE = z.string().length(FAMILY_JOIN_CODE_LENGTH);