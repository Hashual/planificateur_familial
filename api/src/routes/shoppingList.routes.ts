import { Router } from 'express';
import {createShoppingList, deleteShoppingList, getAllShoppingLists, getShoppingListById,} from '../models/shoppingList/shoppingList';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { getShoppingListArticles } from '../models/shoppingList/shoppingListArticle';
import * as shoppingListArticlesRoutes from './shoppingListArticles.routes';
import { SHOPPING_LIST_ID_TYPE, shoppingListIdMiddleware } from '../middlewares/shoppingList/shoppingList.middleware';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';


const router = Router();

router.get('/', async (req, res) => {
    const shoppingLists = await getAllShoppingLists();

    res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: shoppingLists });
});

router.post('/', handler({
    body: z.object({
        title: z.string(),
    }),
    handler: async (req, res) => {
        const { title } = req.body;

        const shoppingListId = await createShoppingList(title);
        const shoppingList = await getShoppingListById(shoppingListId);

        if (!shoppingList) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Failed to create shopping list' });
            return;
        }

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: shoppingList });
    },
}));

router.get('/:listId', handler({
    params: z.object({
        listId: SHOPPING_LIST_ID_TYPE,
    }),
    use: shoppingListIdMiddleware,
    handler: async (req, res) => {
        const { shoppingList } = req;

        if (!shoppingList) {
            res.status(StatusCodes.NOT_FOUND).json({ code: StatusCodes.NOT_FOUND, message: 'Shopping list not found' });
            return;
        }

        const articles = await getShoppingListArticles(shoppingList.id);

        res.status(StatusCodes.OK).json({code: StatusCodes.OK, message: ReasonPhrases.OK, data: {...shoppingList, articles}, });
    },
}));

router.delete('/:listId', handler({
    params: z.object({
        listId: SHOPPING_LIST_ID_TYPE,
    }),
    use: shoppingListIdMiddleware,
    handler: async (req, res) => {
        const { shoppingList } = req;

        if (!shoppingList) {
            res.status(StatusCodes.NOT_FOUND).json({ code: StatusCodes.NOT_FOUND, message: 'Shopping list not found' });
            return;
        }

        await deleteShoppingList(shoppingList.id);

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: 'Shopping list deleted successfully' });
    },
}));

router.use('/', shoppingListArticlesRoutes.default);

export default router;
