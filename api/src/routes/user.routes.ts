import { Router } from "express";
import { handler } from "../utils/handler";
import { isConnectedMiddleware } from "../middlewares/auth/isConnected.middleware";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get('/me', handler({
	use: isConnectedMiddleware,
	handler: async (req, res) => {
		const { user } = req;

		res.status(StatusCodes.OK).json({
			code: 200,
			data: user
		})
	}
}))

// TODO: A /logout route that will delete the session from the database

export default router;