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
 *  "data": [
 *  {
 *  "id": 1,
 *  "title": "Supermarché",
 *  "numberOfInProgressArticles": 2,
 *  "numberOfArticles": 2,
 *  "createdAt": "2025-01-07T18:51:44.000Z",
 *  "updatedAt": "2025-01-07T18:51:44.000Z"
 *  }
 *  ]
 *  }
 *
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": []
 *  }
 *
 *  @apiErrorExample {none} Error
 *  {
 *
 *  }
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
