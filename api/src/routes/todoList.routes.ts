import { Router } from 'express';
import { createTodoList, deleteTodoList, getAllTodoLists, getTodoListById } from '../models/todo/todoList';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { getTodoListTasks } from '../models/todo/todoListTask';
import * as todoListTasksRoutes from './todoListTasks.routes';
import { TODO_LIST_ID_TYPE, todoListIdMiddleware } from '../middlewares/todo/todoList.middleware';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const router = Router();

/**
 * @api {get} /todo-list Get Todo Lists
 * @apiName GetTodoLists
 * @apiGroup TodoList
 * @apiParam {none} none
 * @apiSuccess {Object[]} data List of todo lists
 * @apiSuccess {Number} data.id Todo list id
 * @apiSuccess {String} data.title Todo list title
 * @apiSuccess {Date} data.createdAt Todo list creation date
 * @apiSuccess {Date} data.updatedAt Todo list update date
 * @apiSuccessExample {json} Success
 *  * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": 
 * [{	
*  		"id": 1,
*  		"title": "Todo list 1",
* 		"createdAt": "2025-01-07T18:51:44.000Z",
* 		"updatedAt": "2025-01-07T18:51:44.000Z"
* }]
 * }
 * 
 * @apiSuccessExample {json} Success	
 * HTTP/1.1 200 OK
 * {
 * "code": 200,
 * "message": "OK",
 * "data": []
 * }
 * 	 
 *@apiErrorExample {none} Error
 * {
 * 
 * }
 *  
*/

router.get('/', async (req, res) => {
    const todoList = await getAllTodoLists();

    res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: todoList });
});

router.post('/', handler({
	body: z.object({
		title: z.string()
	}),
	handler: async (req, res) => {
		const { title } = req.body;

		const todoListId = await createTodoList(title);
		const todoList = await getTodoListById(todoListId)!;

		res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: todoList });
	}
}))

router.get('/:listId', handler({
	params: z.object({
		listId: TODO_LIST_ID_TYPE
	}),
	use: todoListIdMiddleware,
    handler: async (req, res) => {
		const { todoList } = req;

		const tasks = await getTodoListTasks(todoList.id);

		res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: { ...todoList, tasks } });
	}
}));

router.delete('/:listId', handler({
	params: z.object({
		listId: TODO_LIST_ID_TYPE
	}),
	use: todoListIdMiddleware,
	handler: async (req, res) => {
		const { todoList } = req;

		await deleteTodoList(todoList.id);

		res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK });
	}
}))

router.use('/', todoListTasksRoutes.default);

export default router;