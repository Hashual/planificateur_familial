import { Router } from "express";
import { handler } from "../utils/handler";
import { z } from "zod";
import { isConnectedMiddleware } from "../middlewares/auth/isConnected.middleware";
import { createFamily } from "../models/families/family";
import { FAMILY_ID_TYPE, familyIdMiddleware } from "../middlewares/families/familyId.middleware";
import { FAMILY_CODE_TYPE } from "../middlewares/families/familyCodeMiddleware";
import { getUserFamilies, joinFamily } from "../models/families/members";
import { joinFamilyMiddleware } from "../middlewares/families/joinFamilyMiddleware";

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

router.get('/:familyId', handler({
	params: z.object({
		familyId: FAMILY_ID_TYPE
	}),
	use: familyIdMiddleware,
	handler: async (req, res) => {
		const { family } = req;

		res.status(200).json({ code: 200, data: family });
	}
}))

router.post('/join', handler({
	body: z.object({
		code: FAMILY_CODE_TYPE
	}),
	use: joinFamilyMiddleware,
	handler: async (req, res) => {
		const { user, family } = req;

		await joinFamily(family, user);

		res.status(200).json({ code: 200, data: { familyId: family.id } });
	}
}))

export default router;