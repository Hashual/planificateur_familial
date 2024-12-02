import { Router } from 'express';
import { handler } from '../utils/handler';
import { z } from 'zod';
import {
    createShoppingListArticle,
    getShoppingListArticleById,
    getShoppingListArticles,
    updateShoppingListArticle,
    deleteShoppingListArticle,
} from '../models/shoppingList/shoppingListArticle';

const router = Router();

router.post('/', handler({
    params: z.object({
        shoppingListId: z.coerce.number().int(),
    }),
    body: z.object({
        title: z.string(),
        dueDate: z.date().optional(),
    }),
    handler: async (req, res) => {
        const { shoppingListId } = req.params;
        const { title, dueDate } = req.body;

        const newArticleId = await createShoppingListArticle(shoppingListId, title, dueDate);
        if (!newArticleId) {
            res.status(500).json({ code: 500, message: 'Failed to create article' });
            return;
        }

        const articles = await getShoppingListArticles(shoppingListId);
        res.status(200).json({ code: 200, message: 'Success', data: articles });
    },
}));

router.get('/:shoppingListId', handler({
    params: z.object({
        shoppingListId: z.coerce.number().int(),
    }),
    handler: async (req, res) => {
        const { shoppingListId } = req.params;

        const articles = await getShoppingListArticles(shoppingListId);
        if (!articles) {
            res.status(404).json({ code: 404, message: 'No articles found' });
            return;
        }

        res.status(200).json({ code: 200, message: 'Success', data: articles });
    },
}));

router.put('/:articleId', handler({
    params: z.object({
        articleId: z.coerce.number().int(),
    }),
    body: z.object({
        title: z.string(),
        dueDate: z.date().optional(),
        isCompleted: z.boolean(),
    }),
    handler: async (req, res) => {
        const { articleId } = req.params;
        const { title, dueDate, isCompleted } = req.body;

        const article = await getShoppingListArticleById(articleId);
        if (!article) {
            res.status(404).json({ code: 404, message: 'Article not found' });
            return;
        }

        const updated = await updateShoppingListArticle(articleId, title, dueDate, isCompleted);
        if (!updated) {
            res.status(500).json({ code: 500, message: 'Failed to update article' });
            return;
        }

        const updatedArticles = await getShoppingListArticles(article.shoppingListId);
        res.status(200).json({ code: 200, message: 'Success', data: updatedArticles });
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

        await deleteShoppingListArticle(articleId);
        res.status(200).json({ code: 200, message: 'Article deleted successfully' });
    },
}));

export default router;
