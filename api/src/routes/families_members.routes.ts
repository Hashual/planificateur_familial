import { Router } from "express";
import { handler } from "../utils/handler";
import { familyIdMiddleware } from "../middlewares/families/familyId.middleware";
import { getFamilyMembers } from "../models/families/members";

const router = Router();

router.get('/:familyId/members', handler({
	use: familyIdMiddleware,
	handler: async (req, res) => {
		const { family } = req;

		res.status(200).json({ code: 200, data: await getFamilyMembers(family) });
	}
}))

export default router;