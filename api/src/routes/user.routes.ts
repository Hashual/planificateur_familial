import { Router } from "express";
import { handler } from "../utils/handler";
import { isConnectedMiddleware } from "../middlewares/auth/isConnected.middleware";
import { StatusCodes } from "http-status-codes";
import { deleteSessionById } from "../models/sessions/sessions";

const router = Router();

router.get('/me', handler({
	use: isConnectedMiddleware,
	handler: async (req, res) => {
		const { user } = req;

		res.status(StatusCodes.OK).json({
			code: StatusCodes.OK,
			data: user
		})
	}
}))

router.post('/logout', handler({
	use: isConnectedMiddleware,
	handler: async (req, res) => {
		const { user } = req;

		const result = await deleteSessionById(user); 

		if (result) {
			res.status(StatusCodes.OK).json({
				code: StatusCodes.OK,
				message: 'Successfully logged out'
			});
		} else {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				code: StatusCodes.INTERNAL_SERVER_ERROR,
				message: 'Failed to log out'
			});
		}
	}}
));

export default router;