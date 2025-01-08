import { Router } from "express";
import { handler } from "../utils/handler";
import { z } from "zod";
import { createUser, getUserByEmail, UserProvider } from "../models/user/user";
import { createSessionForUser, getSessionById } from "../models/sessions/sessions";

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
			provider: UserProvider.Local,
			providerId: null
		});

		if (!userId) {
			res.status(500).json({ code: 500, message: 'Failed to create user' });
			return;
		}

		res.status(200).json({ code: 200, data: { userId } });
	}
}));

router.post('/login', handler({
	body: z.object({
		email: z.string().email(),
		password: z.string().min(8).max(100)
	}),
	handler: async (req, res) => {
		const { email, password } = req.body;

		const user = await getUserByEmail(email, password);

		if (!user) {
			res.status(401).json({ code: 401, message: 'Invalid email or password' });
			return;
		}

		const sessionTokenId = await createSessionForUser(user);
		if (!sessionTokenId) {
			res.status(500).send({ code: 500, message: 'Failed to create session' });
			return;
		}
	
		const session = await getSessionById(sessionTokenId);
		if (!session) {
			res.status(500).send({ code: 500, message: 'Failed to get session' });
			return;
		}
		
		res.status(200).json({ code: 200, data: { token: session.token } });
	}
}));

export default router;