import { Router } from 'express';
import {
    createShoppingList,
    deleteShoppingList,
    getAllShoppingLists,
    getShoppingListById,
    updateShoppingList,
} from '../models/shoppingList/shoppingList';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { getShoppingListArticles } from '../models/shoppingList/shoppingListArticle';
import * as shoppingListArticlesRoutes from './shoppingListArticles.routes';
import { SHOPPING_LIST_ID_TYPE, shoppingListIdMiddleware } from '../middlewares/shoppingList/shoppingList.middleware';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import {isConnectedMiddleware} from "../middlewares/auth/isConnected.middleware";

const router = Router();

/**API GET
 * @api {get} /shopping-list Get Shopping Lists
 * @apiName GetShoppingLists
 * @apiGroup ShoppingList
 * @apiParam {none} none
 * @apiSuccess {Object[]} data List of shopping lists
 * @apiSuccess {Number} data.id Shopping list id
 * @apiSuccess {String} data.title Shopping list title
 * @apiSuccess {Number} data.numberOfInProgressArticles Number of in progress articles
 * @apiSuccess {Number} data.numberOfArticles Number of articles
 * @apiSuccess {Date} data.createdAt Shopping list creation date
 * @apiSuccess {Date} data.updatedAt Shopping list update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *      "id": 1,
 *      "title": "Supermarché",
 *      "numberOfInProgressArticles": 2,
 *      "numberOfArticles": 2,
 *      "createdAt": "2025-01-07T18:51:44.000Z",
 *      "updatedAt": "2025-01-07T18:51:44.000Z"}]
 *  }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": []
 *  }
 *  @apiErrorExample {none} Error
 *  {
 *
 *  }
*/

/** API POST
 * @api {post} /shopping-list Create Shopping List
 * @apiName CreateShoppingList
 * @apiGroup ShoppingList
 * @apiBody {String} title Shopping list title
 * @apiSuccess {Object} data Shopping list
 * @apiSuccess {Number} data.id Shopping list id
 * @apiSuccess {String} data.title Shopping list title
 * @apiSuccess {Number} data.numberOfInProgressArticles Shopping list articles buy in progress
 * @apiSuccess {Number} data.numberOfArticles Shopping list articles
 * @apiSuccess {Date} data.createdAt Shopping list creation date
 * @apiSuccess {Date} data.updatedAt Shopping list update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *      "id": 1,
 *      "title": "Supermarché",
 *      "numberOfInProgressArticles": 2,
 *      "numberOfArticles": 2,
 *      "createdAt": "2025-01-07T18:51:44.000Z",
 *      "updatedAt": "2025-01-07T18:51:44.000Z"}]
 *  }
 * @apiErrorExample {none} Error
 * {
 * 
 * }  
*/

/** API GET 
 * @api {get} /shopping-list/:listId Get Shopping List articles by Id
 * @apiName GetShoppingList
 * @apiGroup ShoppingList
 * @apiParam {Number} listId Shopping list id
 * @apiSuccess {Object} data Shopping list
 * @apiSuccess {Number} data.id Shopping list id
 * @apiSuccess {String} data.title Shopping list title
 * @apiSuccess {Number} data.numberOfInProgressArticles Shopping list articles buy in progress
 * @apiSuccess {Number} data.numberOfArticles Shopping list articles
 * @apiSuccess {Date} data.createdAt Shopping list creation date
 * @apiSuccess {Date} data.updatedAt Shopping list update date
 * @apiSuccess {Object[]} data.articles List of shopping list articles
 * @apiSuccess {Number} data.articles.id Shopping list article id
 * @apiSuccess {Number} data.articles.shoppingListId Shopping list id
 * @apiSuccess {String} data.articles.title Article title
 * @apiSuccess {Number} data.quantity Shopping list article quantity
 * @apiSuccess {Date} data.articles.dueDate Shopping list article due date
 * @apiSuccess {Date} data.articles.completedAt Shopping list article completion date
 * @apiSuccess {Date} data.articles.createdAt Shopping list article creation date
 * @apiSuccess {Date} data.articles.updatedAt Shopping list article update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *      "id": 1,
 *      "title": "Supermarché",
 *      "numberOfInProgressArticles": 2,
 *      "numberOfArticles": 2, 
 *      "createdAt": "2025-01-07T18:51:44.000Z",
 *      "updatedAt": "2025-01-07T18:51:44.000Z",
 *      "articles": [{
 *          "id": 1,
 *          "shoppingListId": 1,
 *          "title": "Pain",
 *          "quantity": 1,
 *          "dueDate": "2025-01-07T18:51:44.000Z",
 *          "completedAt": null,
 *          "createdAt": "2025-01-07T18:51:44.000Z",
 *          "updatedAt": "2025-01-07T18:51:44.000Z"}]
 *  }]
 * }
 * @apiErrorExample {none} Error
 * {
 * 
 * }
*/

/** API DELETE
 * @api {delete} /shopping-list/:listId Delete Shopping List
 * @apiName DeleteShoppingList
 * @apiGroup ShoppingList
 * @apiParam {Number} listId Shopping list id
 * @apiSuccess {String} message Shopping list deleted successfully
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "Shopping list deleted successfully"
 * }
 * @apiErrorExample {none} Error
 * HTTP/1.1 404 NOT_FOUND
 * {
 *  "code": 404,
 *  "message": "Shopping list not found"
 * }
 * @apiErrorExample {none} Error
 * {
 * 
 * }
 */

router.get('/', handler({
    use: isConnectedMiddleware,
    handler: async (req, res) => {
    const { user } = req;

    const shoppingLists = await getAllShoppingLists(user);

    res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: shoppingLists });
    }
}));

router.post('/', handler({
    body: z.object({
        title: z.string(),
    }),
    use: isConnectedMiddleware,
    handler: async (req, res) => {
        const { user } = req;
        const { title } = req.body;

        const shoppingListId = await createShoppingList(title, user);
        const shoppingList = await getShoppingListById(shoppingListId);

        if (!shoppingList) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Failed to create shopping list' });
            return;
        }

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: shoppingList });
    },
}));


/**
 * @api {put} /shopping-list/:listId Update Shopping List
 * @apiName UpdateShoppingList
 * @apiGroup ShoppingList
 * @apiParam {Number} listId Shopping list id
 * @apiBody {String} title Shopping list title
 * @apiSuccess {Object} data Shopping list
 * @apiSuccess {Number} data.id Shopping list id
 * @apiSuccess {String} data.title Shopping list title
 * @apiSuccess {Number} data.numberOfInProgressArticles Shopping list articles buy in progress
 * @apiSuccess {Number} data.numberOfArticles Shopping list articles
 * @apiSuccess {Date} data.createdAt Shopping list creation date
 * @apiSuccess {Date} data.updatedAt Shopping list update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 * "code": 200,
 * "message": "OK",
 * "data": {
 *         "id": 1,
 *         "title": "Supermarché",
 *         "numberOfInProgressArticles": 2,
 *         "numberOfArticles": 2,
 *         "createdAt": "2025-01-07T18:51:44.000Z",
 *         "updatedAt": "2025-01-07T18:51:44.000Z"
 *         }
 *     }
 * @apiErrorExample {none} Error
 * {
 * "code": 404,
 * "message": "Shopping list not found"
 * }
 *
**/

router.put('/:listId', handler({
    params: z.object({
        listId: SHOPPING_LIST_ID_TYPE,
    }),
    body: z.object({
        title: z.string(),
    }),
    use: shoppingListIdMiddleware,
    handler: async (req, res) => {
        const { shoppingList } = req;
        const { title } = req.body;

        if (!shoppingList) {
            res.status(StatusCodes.NOT_FOUND).json({ code: StatusCodes.NOT_FOUND, message: 'Shopping list not found' });
            return;
        }

        await updateShoppingList(shoppingList.id, title);

        const updatedShoppingList = await getShoppingListById(shoppingList.id);

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: { updatedShoppingList } });
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
