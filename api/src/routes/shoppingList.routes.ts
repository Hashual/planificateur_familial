import { Router } from 'express';
import {createShoppingList, deleteShoppingList, getAllShoppingLists, getShoppingListById,} from '../models/shoppingList/shoppingList';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { getShoppingListArticles } from '../models/shoppingList/shoppingListArticle';
import * as shoppingListArticlesRoutes from './shoppingListArticles.routes';
import { SHOPPING_LIST_ID_TYPE, shoppingListIdMiddleware } from '../middlewares/shoppingList/shoppingList.middleware';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';


const router = Router();

/**
 * @api {get} /shopping-list Get Shopping Lists
 * @apiName GetShoppingLists
 * @apiGroup ShoppingList
 * @apiSuccess {Object[]} shoppingLists List of Shopping Lists.
 * @apiSuccess {Number} shoppingLists.id Shopping List unique ID.
 * @apiSuccess {String} shoppingLists.title Shopping List title.
 * @apiSuccess {String} shoppingLists.createdAt Shopping List creation date.
 * @apiSuccess {String} shoppingLists.updatedAt Shopping List last update date.
 * @apiSuccess {Object[]} shoppingLists.articles List of Shopping List articles.
 * @apiSuccess {Number} shoppingLists.articles.id Article unique ID.
 * @apiSuccess {String} shoppingLists.articles.name Article name.
 * @apiSuccess {Number} shoppingLists.articles.quantity Article quantity.
 * @apiSuccess {String} shoppingLists.articles.unit Article unit.
 * @apiSuccess {String} shoppingLists.articles.createdAt Article creation date.
 * @apiSuccess {String} shoppingLists.articles.updatedAt Article last update date.
 * @apiSuccess {String} shoppingLists.articles.shoppingListId Shopping List unique ID.
 * @apiSuccess {String} shoppingLists.articles.categoryId Article category unique ID.
 * @apiSuccess {String} shoppingLists.articles.userId Article user unique ID.
 * @apiSuccess {String} shoppingLists.articles.checked Article checked status.
 * @apiSuccess {String} shoppingLists.articles.checkedAt Article checked date.
 * @apiSuccess {String} shoppingLists.articles.checkedBy Article checked by user unique ID.
 * @apiSuccess {String} shoppingLists.articles.checkedByName Article checked by user name.
 * @apiSuccess {String} shoppingLists.articles.checkedByAvatar Article checked by user avatar.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *    "code": 200,
 *    "message": "OK",
 *    "data": [
 *    {
 *    "id": 1,
 *    "title": "Liste de courses",
 *    "createdAt": "2021-04-23T17:00:00.000Z",
 *    "updatedAt": "2021-04-23T17:00:00.000
 *    "articles": [
 *    {
 *    "id": 1,
 *    "name": "Pain",
 *    "quantity": 1,
 *    "unit": "unité",
 *    "createdAt": "2021-04-23T17:00:00.000
 *    "updatedAt": "2021-04-23T17:00:00.000
 *    "shoppingListId": 1,
 *    "categoryId": 1,
 *    "userId": 1,
 *    "checked": false,
 *    "checkedAt": null,
 *    "checkedBy": null,
 *    "checkedByName": null,
 *    "checkedByAvatar": null
 *    }
 *    ]
 *    }
 *    ]
 *    }
 *
 *    @apiErrorExample Error-Response:
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *    "code": 500,
 *    "message": "Failed to create shopping list"
 *    }
 *
 *
 */
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

/**
 * @api {get} /shopping-list/:listId Get Shopping List
 * @apiName GetShoppingList
 * @apiGroup ShoppingList
 * @apiParam {Number} listId Shopping List unique ID.
 * @apiSuccess {Object} shoppingList Shopping List details.
 * @apiError {404} NotFound Shopping List not found.
 */
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
