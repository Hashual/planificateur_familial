import { Router } from 'express';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { createShoppingListArticle, getShoppingListArticleById, getShoppingListArticles, updateShoppingListArticle, deleteShoppingListArticle } from '../models/shoppingList/shoppingListArticle';
import { SHOPPING_LIST_ID_TYPE, shoppingListIdMiddleware } from '../middlewares/shoppingList/shoppingList.middleware';
import { SHOPPING_LIST_ARTICLE_ID_TYPE, shoppingListArticleIdMiddleware } from '../middlewares/shoppingList/shoppingListArticle.middleware';
import HttpError from '../utils/exceptions/HttpError';
import {getShoppingListById} from "../models/shoppingList/shoppingList";
import {StatusCodes, ReasonPhrases} from 'http-status-codes';

const router = Router();

router.post('/', handler({
    use : shoppingListIdMiddleware,
    params: z.object({
        listId: SHOPPING_LIST_ID_TYPE,
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Failed to create article' });
            return;
        }

        const articles = await getShoppingListArticles(listId);
        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: articles });
    },
}));
// TODO : Make dueDate and completedAt date type
router.put('/:articleId/articles/:articleId', handler({
    use: [shoppingListIdMiddleware, shoppingListArticleIdMiddleware],
    params: z.object({
        listId : SHOPPING_LIST_ID_TYPE,
        articleId: SHOPPING_LIST_ARTICLE_ID_TYPE,
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
            res.status(StatusCodes.NOT_FOUND).json({ code: StatusCodes.NOT_FOUND, message: 'Article not found' });
            return;
        }
        
        const dateOfDue = dueDate ? new Date(dueDate) : null;
        const dateOfCompletedAt = completedAt ? new Date(completedAt) : null;

        const updated = await updateShoppingListArticle(articleId, title, dateOfDue, dateOfCompletedAt);
        if (!updated) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Failed to update article' });
            return;
        }

        const updateList = await getShoppingListById(article.shoppingListId);
        const articles = await getShoppingListArticles(article.shoppingListId);
        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: {...updateList, articles} });
    },
}));

router.delete('/:articleId/articles/articleId', handler({
    use: [shoppingListIdMiddleware, shoppingListArticleIdMiddleware],
    params: z.object({
        listId : SHOPPING_LIST_ID_TYPE,
        articleId: SHOPPING_LIST_ARTICLE_ID_TYPE,
    }),
    handler: async (req, res) => {
        const { articleId } = req.params;

        const article = await getShoppingListArticleById(articleId);

        if (!article) {
            res.status(StatusCodes.NOT_FOUND).json({ code: StatusCodes.NOT_FOUND, message: 'Article not found' });
            return;
        }

        const listId = article.shoppingListId;
        await deleteShoppingListArticle(articleId);

        const list = await getShoppingListById(listId);
        const articles = await getShoppingListArticles(listId);

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: 'Article deleted successfully', data: {...list, articles} });
    },
}));

export default router;
