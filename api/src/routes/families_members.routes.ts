import { Router } from "express";
import { handler } from "../utils/handler";
import { FAMILY_ID_TYPE, familyIdMiddleware } from "../middlewares/families/familyId.middleware";
import { getFamilyMembers, removeFamilyMember } from "../models/families/members";
import { manageFamilyMemberMiddleware } from "../middlewares/families/manageFamilyMemberMiddleware";
import { FAMILY_MEMBER_ID_TYPE } from "../middlewares/families/familyMemberMiddleware";

const router = Router();

router.get('/:familyId/members', handler({
	params: {
		familyId: FAMILY_ID_TYPE,
	},
	use: familyIdMiddleware,
	handler: async (req, res) => {
		const { family } = req;

		res.status(200).json({ code: 200, data: await getFamilyMembers(family) });
	}
}))

router.delete('/:familyId/members/:memberId', handler({
	params: {
		familyId: FAMILY_ID_TYPE,
		memberId: FAMILY_MEMBER_ID_TYPE,
	},
	use: manageFamilyMemberMiddleware,
	handler: async (req, res) => {
		const { family, user, familyMember } = req;

		await removeFamilyMember(family, familyMember);

		res.status(200).json({ code: 200, message: "Membre supprimé" });
	}
}))

export default router;