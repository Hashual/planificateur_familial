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

/** API POST
 * @api {post} /api/shopping-lists/:listId/articles Create a new article
 * @apiName CreateShoppingListArticle
 * @apiGroup ShoppingListArticles
 * @apiParam {String} listId The id of the shopping list
 * @apiBody {String} title The title of the article
 * @apiBody {Date} [dueDate] The due date of the article
 * @apiBody {Number} quantity The quantity of the article
 * @apiSuccess {Object} data The list of articles
 * @apiSuccess {Number} data.id The id of the article
 * @apisuccess {Number} data.shoppingListId The id of the shopping list
 * @apiSuccess {String} data.title The title of the article
 * @apiSuccess {Number} data.quantity The quantity of the article
 * @apiSuccess {Date} data.dueDate The due date of the article
 * @apiSuccess {Date} data.completedAt The completion date of the article
 * @apiSuccess {Date} data.createdAt The creation date of the article
 * @apiSuccess {Date} data.updatedAt The last update date of the article
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *      "id": 1,
 *      "shoppingListId": 1,
 *      "title": "Article 1",
 *      "quantity": 1,
 *      "dueDate": "2021-09-01T00:00:00.000Z",
 *      "completedAt": null,
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"}]
 * }
 * @apiErrorExample {json} 
 * HTTP/1.1 500 INTERNAL_SERVER_ERROR
 * {
 *  "code": 500,
 *  "message": "Failed to create article"
 * }
 * @apiErrorExample {json} List not found
 * {
 * 
 * } 
*/

/** API PUT
 * @api {put} /api/shopping-lists/:listId/articles/:articleId Update an article
 * @apiName UpdateShoppingListArticle
 * @apiGroup ShoppingListArticles
 * @apiParam {String} listId The id of the shopping list
 * @apiParam {String} articleId The id of the article
 * @apiBody {String} title The title of the article
 * @apiBody {Date} [dueDate] The due date of the article
 * @apiBody {Date} [completedAt] The completion date of the article
 * @apiSuccess {Object} data The list of articles
 * @apiSuccess {Number} data.id The id of the article
 * @apisuccess {Number} data.shoppingListId The id of the shopping list
 * @apiSuccess {String} data.title The title of the article
 * @apiSuccess {Number} data.quantity The quantity of the article
 * @apiSuccess {Date} data.dueDate The due date of the article
 * @apiSuccess {Date} data.completedAt The completion date of the article
 * @apiSuccess {Date} data.createdAt The creation date of the article
 * @apiSuccess {Date} data.updatedAt The last update date of the article
 * @apiSuccessExample {json} Success
 * // If the shopping list only have one article
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *      "id": 1,
 *      "title":"Shopping List 1",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z",
 *      articles: [{    
 *          "id": 1,
 *          "shoppingListId": 1,
 *          "title": "Article 1",
 *          "quantity": 1,
 *          "dueDate": "2021-09-01T00:00:00.000Z",
 *          "completedAt": null,
 *          "createdAt": "2021-09-01T00:00:00.000Z",
 *          "updatedAt": "2021-09-01T00:00:00.000Z"}]
 * }
 * @apiSuccessExample {json} Success
 * // If the shopping list contains multiple articles
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *      "id": 1,
 *      "title":"Shopping List 1",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z",
 *      articles: [{    
 *          "id": 1,
 *          "shoppingListId": 1,
 *          "title": "Tomatoes",
 *          "quantity": 4,
 *          "dueDate": "2021-09-01T00:00:00.000Z",
 *          "completedAt": null,
 *          "createdAt": "2021-09-01T00:00:00.000Z",
 *          "updatedAt": "2021-09-01T00:00:00.000Z"},
 *          {
 *          "id": 2,
 *          "shoppingListId": 1,
 *          "title": "Potatoes",
 *          "quantity": 2,
 *          "dueDate": "2021-09-01T00:00:00.000Z",
 *          "completedAt": null,
 *          "createdAt": "2021-09-01T00:00:00.000Z",
 *          "updatedAt": "2021-09-01T00:00:00.000Z"},
 *         {
 *          "id": 3,
 *          "shoppingListId": 1,
 *          "title": "Carrots",
 *          "quantity": 3,
 *          "dueDate": "2021-09-01T00:00:00.000Z",
 *          "completedAt": null,
 *          "createdAt": "2021-09-01T00:00:00.000Z",
 *          "updatedAt": "2021-09-01T00:00:00.000Z"}]}]
 * } 
 * @apiErrorExample {json}
 * HTTP/1.1 500 INTERNAL_SERVER_ERROR
 * {
 *  "code": 500,
 *  "message": "Failed to update article"
 * }
 * @apiErrorExample {json} Article not found
 * {
 *  "code": 404,
 *  "message": "Article not found"
 * }
 * @apiErrorExample {json} 
 * {
 * 
 * }
 */

/** API DELETE
 * @api {delete} /api/shopping-lists/:listId/articles/:articleId Delete an article
 * @apiName DeleteShoppingListArticle
 * @apiGroup ShoppingListArticles
 * @apiParam {Number} listId The id of the shopping list
 * @apiParam {Number} articleId The id of the article
 * 
 * @apiSuccess {Object} data The shopping list
 * @apiSuccess {Number} data.id The id of the shopping list
 * @apiSuccess {String} data.title The title of the shopping list
 * @apiSuccess {Date} data.createdAt The creation date of the shopping list
 * @apiSuccess {Date} data.updatedAt The last update date of the shopping list
 * @apiSuccess {Array} data.articles The list of articles
 * @apiSuccess {Number} data.id The id of the article
 * @apisuccess {Number} data.shoppingListId The id of the shopping list
 * @apiSuccess {String} data.title The title of the article
 * @apiSuccess {Number} data.quantity The quantity of the article
 * @apiSuccess {Date} data.dueDate The due date of the article
 * @apiSuccess {Date} data.completedAt The completion date of the article
 * @apiSuccess {Date} data.createdAt The creation date of the article
 * @apiSuccess {Date} data.updatedAt The last update date of the article
 * @apiSuccessExample {json} Success
 * // If the shopping list only have one article
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "Article deleted successfully",
 *  "data": [{
 *      "id": 1,
 *      "title":"Shopping List 1",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z",
 *      articles: []}]
 * }
 * @apiSuccessExample {json} Success
 * // If the shopping list contains multiple articles
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *      "id": 1,
 *      "title":"Shopping List 1",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z",
 *      articles: [{    
 *          "id": 1,
 *          "shoppingListId": 1,
 *          "title": "Tomatoes",
 *          "quantity": 4,
 *          "dueDate": "2021-09-01T00:00:00.000Z",
 *          "completedAt": null,
 *          "createdAt": "2021-09-01T00:00:00.000Z",
 *          "updatedAt": "2021-09-01T00:00:00.000Z"},
 *          {
 *          "id": 2,
 *          "shoppingListId": 1,
 *          "title": "Potatoes",
 *          "quantity": 2,
 *          "dueDate": "2021-09-01T00:00:00.000Z",
 *          "completedAt": null,
 *          "createdAt": "2021-09-01T00:00:00.000Z",
 *          "updatedAt": "2021-09-01T00:00:00.000Z"}]}]
 * }
 * @apiErrorExample {json}
 * HTTP/1.1 404 NOT_FOUND
 * {
 *  "code": 404,
 *  "message": "Article not found"
 * }
 * @apiErrorExample {json}
 * {
 * 
 * }
*/

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
