import { Router } from "express";
import { handler } from "../utils/handler";
import { isConnectedMiddleware } from "../middlewares/auth/isConnected.middleware";
import { StatusCodes } from "http-status-codes";
import { deleteSessionById } from "../models/sessions/sessions";
import { z } from "zod";
import comparePassword from "../utils/auth/comparePassword";
import { updateUser } from "../models/user/user";

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

router.put('/me', handler({
	use: isConnectedMiddleware,
	body: z.object({
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		email: z.string().email().optional(),
		password: z.string().optional(),
		oldPassword: z.string().optional(),
	}),
	handler: async (req, res) => {
		const { user } = req;
		const { firstName, lastName, email, password, oldPassword } = req.body;

		// If the user wants to update his password, if a password is already set, we check if the old password is correct
		if (password && user.password) {
			if (!oldPassword) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					code: StatusCodes.BAD_REQUEST,
					message: 'You must provide your old password'
				});
			} else if (!(await comparePassword(oldPassword, user.password))) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					code: StatusCodes.UNAUTHORIZED,
					message: 'Old password is incorrect'
				});
			}
		}

		const updatedUser = await updateUser(user.id, {
			firstName,
			lastName,
			email,
			password
		});

		if (updatedUser) {
			res.status(StatusCodes.OK).json({
				code: StatusCodes.OK,
				message: 'User updated successfully'
			});
		} else {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				code: StatusCodes.INTERNAL_SERVER_ERROR,
				message: 'Failed to update user'
			});
		}

		res.status(StatusCodes.OK).json({
			code: StatusCodes.OK,
			message: 'User updated successfully'
		})
	}
}));

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