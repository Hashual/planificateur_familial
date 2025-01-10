import { Router } from 'express';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { createShoppingListArticle, getShoppingListArticles, updateShoppingListArticle, deleteShoppingListArticle } from '../models/shoppingList/shoppingListArticle';
import { SHOPPING_LIST_ID_TYPE, shoppingListIdMiddleware } from '../middlewares/shoppingList/shoppingList.middleware';
import { SHOPPING_LIST_ARTICLE_ID_TYPE, shoppingListArticleIdMiddleware } from '../middlewares/shoppingList/shoppingListArticle.middleware';
import {getShoppingListById} from "../models/shoppingList/shoppingList";
import {StatusCodes, ReasonPhrases} from 'http-status-codes';

const router = Router();

router.post('/:listId/articles', handler({
    use : shoppingListIdMiddleware,
    params: z.object({
        listId: SHOPPING_LIST_ID_TYPE,
    }),
    body: z.object({
        title: z.string(),
        dueDate: z.date().optional().nullable(),
        quantity: z.number(),
    }),
    handler: async (req, res) => {
        
        const { shoppingList } = req;
        const { title, dueDate, quantity} = req.body;

        const newArticleId = await createShoppingListArticle(shoppingList.id, title, dueDate, quantity);

        if (!newArticleId) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Failed to create article' });
            return;
        }

        const articles = await getShoppingListArticles(shoppingList.id);
        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: articles });
    },
}));
// TODO : Make dueDate and completedAt date type
router.put('/:listId/articles/:articleId', handler({
    use: [shoppingListIdMiddleware, shoppingListArticleIdMiddleware],
    params: z.object({
        listId : SHOPPING_LIST_ID_TYPE,
        articleId: SHOPPING_LIST_ARTICLE_ID_TYPE,
    }),
    body: z.object({
        title: z.string(),
        dueDate: z.string().optional().nullable(),
        completedAt: z.string().nullable(),
    }),
    handler: async (req, res) => {
        const { article } = req;
        const { title, dueDate, completedAt } = req.body;

        if (!article) {
            res.status(StatusCodes.NOT_FOUND).json({ code: StatusCodes.NOT_FOUND, message: 'Article not found' });
            return;
        }
        
        const dateOfDue = dueDate ? new Date(dueDate) : null;
        const dateOfCompletedAt = completedAt ? new Date(completedAt) : null;

        const updated = await updateShoppingListArticle(article.id, title, dateOfDue, dateOfCompletedAt);
        if (!updated) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Failed to update article' });
            return;
        }

        const updateList = await getShoppingListById(article.shoppingListId);
        const articles = await getShoppingListArticles(article.shoppingListId);
        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: {...updateList, articles} });
    },
}));

router.delete('/:listId/articles/:articleId', handler({
    use: [shoppingListIdMiddleware, shoppingListArticleIdMiddleware],
    params: z.object({
        listId : SHOPPING_LIST_ID_TYPE,
        articleId: SHOPPING_LIST_ARTICLE_ID_TYPE,
    }),
    handler: async (req, res) => {
        const { article } = req;

        if (!article) {
            res.status(StatusCodes.NOT_FOUND).json({ code: StatusCodes.NOT_FOUND, message: 'Article not found' });
            return;
        }

        const listId = article.shoppingListId;
        await deleteShoppingListArticle(article.id);

        const list = await getShoppingListById(listId);
        const articles = await getShoppingListArticles(listId);

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: 'Article deleted successfully', data: {...list, articles} });
    },
}));

export default router;
