import { Router } from "express";
import { handler } from "../utils/handler";
import { isConnectedMiddleware } from "../middlewares/auth/isConnected.middleware";
import { z } from "zod";
import { NotificationTokenProvider, registerUserNotificationToken } from "../models/notifications/tokens";
import { StatusCodes } from "http-status-codes";

const router = Router();
router.post(`/push/token`, handler({
	use: isConnectedMiddleware,
	body: z.object({
		token: z.string()
	}),
	handler: async (req, res) => {
		const { user } = req;
		const { token } = req.body;
		console.log(token);

		await registerUserNotificationToken(user, NotificationTokenProvider.Android, token);

		res.status(StatusCodes.OK).send({ code: StatusCodes.OK, message: 'Token registered', data: {} });
	}
}))

export default router;                                                                           