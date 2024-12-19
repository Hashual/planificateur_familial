import { Router } from 'express';
import { handler } from '../utils/handler';
import { optional, z } from 'zod';
import { createShoppingListArticle, getShoppingListArticleById, getShoppingListArticles, updateShoppingListArticle, deleteShoppingListArticle } from '../models/shoppingList/shoppingListArticle';
import {getShoppingListById} from "../models/shoppingList/shoppingList";

const router = Router();

router.post('/', handler({
    params: z.object({
        listId: z.coerce.number().int(),
    }),
    body: z.object({
        title: z.string(),
        dueDate: z.date().optional(),
    }),
    handler: async (req, res) => {
        const { listId } = req.params;
        const { title, dueDate } = req.body;

        const newArticleId = await createShoppingListArticle(listId, title, dueDate);
        if (!newArticleId) {
            res.status(500).json({ code: 500, message: 'Failed to create article' });
            return;
        }

        const articles = await getShoppingListArticles(listId);
        res.status(200).json({ code: 200, message: 'Success', data: articles });
    },
}));

// TODO : Make dueDate and completedAt date type
router.put('/:articleId', handler({
    params: z.object({
        articleId: z.coerce.number().int(),
    }),
    body: z.object({
        title: z.string(),
        dueDate: z.string().optional(),
        completedAt: z.string().nullable(),
    }),
    handler: async (req, res) => {
        const { articleId } = req.params;
        const { title, dueDate, completedAt } = req.body;

        const article = await getShoppingListArticleById(articleId);
        if (!article) {
            res.status(404).json({ code: 404, message: 'Article not found' });
            return;
        }

        const dateOfDue = dueDate ? new Date(dueDate) : null;
        const dateOfCompletedAt = completedAt ? new Date(completedAt) : null;

        const updated = await updateShoppingListArticle(articleId, title, dateOfDue, dateOfCompletedAt);
        if (!updated) {
            res.status(500).json({ code: 500, message: 'Failed to update article' });
            return;
        }

        const updateList = await getShoppingListById(article.shoppingListId);
        const articles = await getShoppingListArticles(article.shoppingListId);
        res.status(200).json({ code: 200, message: 'Success', data: {...updateList, articles} });
    },
}));

router.delete('/:articleId', handler({
    params: z.object({
        articleId: z.coerce.number().int(),
    }),
    handler: async (req, res) => {
        const { articleId } = req.params;

        const article = await getShoppingListArticleById(articleId);
        if (!article) {
            res.status(404).json({ code: 404, message: 'Article not found' });
            return;
        }

        const listId = article.shoppingListId;
        await deleteShoppingListArticle(articleId);

        const list = await getShoppingListById(listId);
        const articles = await getShoppingListArticles(listId);

        res.status(200).json({ code: 200, message: 'Article deleted successfully', data: {...list, articles} });
    },
}));

export default router;
