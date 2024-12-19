import { Router } from "express";
import { handler } from "../utils/handler";
import { z } from "zod";
import { createUser, getUserByEmail } from "../models/user/user";

const router = Router();

router.post('/register', handler({
	body: z.object({
		lastName: z.string().trim().min(2).max(20),
		firstName: z.string().trim().min(2).max(20),
		email: z.string().email(),
		password: z.string().min(8).max(100)
	}),
	handler: async (req, res) => {
		const { lastName, firstName, email, password } = req.body;

		if (await getUserByEmail(email)) {
			res.status(409).json({ code: 409, message: 'Email already exists' });
			return;
		}

		const userId = await createUser({
			lastName,
			firstName,
			email,
			password,
			avatarUrl: null,
			provider: 'local',
			providerId: null
		});

		if (!userId) {
			res.status(500).json({ code: 500, message: 'Failed to create user' });
			return;
		}

		res.status(200).json({ code: 200, data: { userId } });
	}
}));

export default router;