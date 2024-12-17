import { Request, Response, Router } from "express";
import { getSessionByToken } from "../models/sessions/sessions";
import { getUserById } from "../models/user/user";

const router = Router();

router.get('/me', async (req: Request, res: Response): Promise<void> => {
	const authorizationHeader = req.headers['authorization'];
	if (!authorizationHeader) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}

	const [tokenType, token] = authorizationHeader.split(' ');
	if (tokenType !== 'Bearer' || !token) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}

	const session = await getSessionByToken(token);
	if (!session) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}

	const sessionUser = await getUserById(session.userId)!;

	res.status(200).json({
		code: 200,
		data: sessionUser
	})
})

export default router;