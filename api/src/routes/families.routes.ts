import { Router } from "express";
import { handler } from "../utils/handler";
import { z } from "zod";
import { isConnectedMiddleware } from "../middlewares/auth/isConnected.middleware";
import { createFamily, getUserFamilies } from "../models/families/family";
import { FAMILY_ID_TYPE, familyIdMiddleware } from "../middlewares/families/familyId.middleware";

const router = Router();

router.post('/', handler({
	body: z.object({
		name: z.string().min(2).max(100)
	}),
	use: isConnectedMiddleware,
	handler: async (req, res) => {
		const { user } = req;
		const { name } = req.body;

		const familyId = await createFamily(name, user);

		if (!familyId) {
			res.status(500).json({ code: 500, message: 'Failed to create family' });
			return;
		}

		res.status(200).json({ code: 200, data: { familyId } });
	}
}))

router.get('/', handler({
	use: isConnectedMiddleware,
	handler: async (req, res) => {
		const { user } = req;

		const families = await getUserFamilies(user);

		res.status(200).json({ code: 200, data: families });
	}
}))

router.get('/:id', handler({
	params: z.object({
		id: FAMILY_ID_TYPE
	}),
	use: familyIdMiddleware,
	handler: async (req, res) => {
		const { family } = req;

		res.status(200).json({ code: 200, data: family });
	}
}))

export default router;