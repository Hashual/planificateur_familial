import { Router } from 'express';
import { handler } from '../utils/handler';
import { z } from 'zod';
import {
    createShoppingList,
    deleteShoppingList,
    getAllShoppingLists,
    getShoppingListById,
} from '../models/shoppingList/shoppingList';
import { getShoppingListArticles } from '../models/shoppingList/shoppingListArticle';
import shoppingListArticlesRoutes from './shoppingListArticles.routes';

const router = Router();

router.get('/', async (req, res) => {
    const shoppingLists = await getAllShoppingLists();

    res.status(200).json({ code: 200, message: 'Success', data: shoppingLists });
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
            res.status(500).json({ code: 500, message: 'Failed to create shopping list' });
            return;
        }

        res.status(200).json({ code: 200, message: 'Success', data: shoppingList });
    },
}));

router.get('/:listId', handler({
    params: z.object({
        listId: z.coerce.number().int(),
    }),
    handler: async (req, res) => {
        const { listId } = req.params;

        const shoppingList = await getShoppingListById(listId);
        if (!shoppingList) {
            res.status(404).json({ code: 404, message: 'Shopping list not found' });
            return;
        }

        const articles = await getShoppingListArticles(listId);

        res.status(200).json({
            code: 200,
            message: 'Success',
            data: { ...shoppingList, articles },
        });
    },
}));

router.delete('/:listId', handler({
    params: z.object({
        listId: z.coerce.number().int(),
    }),
    handler: async (req, res) => {
        const { listId } = req.params;

        const shoppingList = await getShoppingListById(listId);
        if (!shoppingList) {
            res.status(404).json({ code: 404, message: 'Shopping list not found' });
            return;
        }

        await deleteShoppingList(listId);

        res.status(200).json({ code: 200, message: 'Shopping list deleted successfully' });
    },
}));

router.use('/:listId/articles', shoppingListArticlesRoutes);

export default router;
