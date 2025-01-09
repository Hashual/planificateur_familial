import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import HttpError from "../../utils/exceptions/HttpError";
import { getSessionByToken } from "../../models/sessions/sessions";
import { getUserById, User } from "../../models/user/user";

export const isConnectedMiddleware = async (req: Request) => {
	const authorizationHeader = req.headers['authorization'];
	console.log(authorizationHeader);
	if (!authorizationHeader) {
		throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
	}

	const [tokenType, token] = authorizationHeader.split(' ');
	console.log(tokenType, token);
	if (tokenType !== 'Bearer' || !token) {
		throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
	}

	const session = await getSessionByToken(token);
	console.log(session);
	if (!session) {
		throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
	}

	const sessionUser = await getUserById(session.userId)!;
	console.log(sessionUser);
	if (!sessionUser) {
		throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
	}

	return Object.assign(req, { user: sessionUser });
}