import { Request } from "express";
import { isConnectedMiddleware } from "../auth/isConnected.middleware";
import { getFamilyById } from "../../models/families/family";
import HttpError from "../../utils/exceptions/HttpError";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export const familyIdMiddleware = async (req: Request) => {
	const newReq = await isConnectedMiddleware(req);

	const { user } = newReq;
	const { familyId } = newReq.params;

	const family = await getFamilyById(parseInt(familyId));

	if (!family) {
		throw new HttpError(StatusCodes.NOT_FOUND, 'Family not found');
	}

	if (family.ownerId !== user.id) {
		throw new HttpError(StatusCodes.FORBIDDEN, 'Forbidden');
	}

	return Object.assign(newReq, { family });
}

export const FAMILY_ID_TYPE = z.coerce.number().int();