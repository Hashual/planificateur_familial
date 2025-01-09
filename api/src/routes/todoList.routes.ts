import { Router } from 'express';
import { createTodoList, deleteTodoList, getAllTodoLists, getTodoListById } from '../models/todo/todoList';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { getTodoListTasks } from '../models/todo/todoListTask';
import * as todoListTasksRoutes from './todoListTasks.routes';
import { TODO_LIST_ID_TYPE, todoListIdMiddleware } from '../middlewares/todo/todoList.middleware';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const router = Router();

/** API GET
 * @api {get} /todo-list Get Todo Lists
 * @apiName GetTodoLists
 * @apiGroup Todo List
 * @apiParam {none} none
 * @apiSuccess {Object[]} data List of todo lists
 * @apiSuccess {Number} data.id Todo list id
 * @apiSuccess {String} data.title Todo list title
 * @apiSuccess {Date} data.createdAt Todo list creation date
 * @apiSuccess {Date} data.updatedAt Todo list update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 * 		"id": 1,
 *  	"title": "Todo list 1",
 * 		"createdAt": "2025-01-07T18:51:44.000Z",
 * 		"updatedAt": "2025-01-07T18:51:44.000Z"
 * 		}]
 * }
 * 
 * @apiSuccessExample {json} Success	
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": []
 * }
 * 	 
 *@apiErrorExample {none} Error
 * {
 * 
 * }
*/

/** API POST
 * @api {post} /todo-list Create Todo List
 * @apiName CreateTodoList
 * @apiGroup Todo List
 * @apiParam {String} title Todo list title
 * @apiSuccess {Object} data Todo list
 * @apiSuccess {Number} data.id Todo list id
 * @apiSuccess {String} data.title Todo list title
 * @apiSuccess {Date} data.createdAt Todo list creation date
 * @apiSuccess {Date} data.updatedAt Todo list update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 * 		"id": 1,
 * 		"title": "Todo list 1",
 * 		"createdAt": "2025-01-07T18:51:44.000Z",
 * 		"updatedAt": "2025-01-07T18:51:44.000Z"
 * 		}]
 * }
 * 
 * @apiSuccessExample {json} Success	
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": []
 * }
 * 
 * @apiErrorExample {none} Error
 * {
 * 
 * }
*/	

/** API GET
 * @api {get} /todo-list/:listId Get Todo List Tasks by Todo List Id
 * @apiName GetTodoListById
 * @apiGroup Todo List
 * @apiParam {Number} todoListId Todo list id
 * @apiSuccess {Object} data Todo list
 * @apiSuccess {Number} data.id Task id
 * @apiSuccess {Number} data.todoListId Todo list id
 * @apiSuccess {String} data.title Todo list title
 * @apiSuccess {Date} data.createdAt Todo list creation date
 * @apiSuccess {Date} data.updatedAt Todo list update date
 * @apiSuccess {Object[]} data.tasks List of tasks

 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 * 		"id": 1,
 * 		"title": "Todo list 1",
 * 		"createdAt": "2025-01-07T18:51:44.000Z",
 * 		"updatedAt": "2025-01-07T18:51:44.000Z",
 * 		"tasks": [{
 * 				"id": 1,	
 * 				"todoListId": 1,
 * 				"title": "Task 1",
 * 				"dueDate": "2025-01-07T18:51:44.000Z",
 * 				"completedDate": "2025-01-07T18:51:44.000Z",
 * 				"createdAt": "2025-01-07T18:51:44.000Z",
 * 				"updatedAt": "2025-01-07T18:51:44.000Z"
 * 			}]
 * 		]}
 * }
 * 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 * 		"id": 1,
 * 		"title": "Todo list 1",
 * 		"createdAt": "2025-01-07T18:51:44.000Z",
 * 		"updatedAt": "2025-01-07T18:51:44.000Z",
 * 		"tasks": [{
 * 				"todoListId": 1,
 * 				"title": "Task 1",
 * 				"dueDate": null,
 * 				"completedDate": null,
 * 				"createdAt": "2025-01-07T18:51:44.000Z",
 * 				"updatedAt": "2025-01-07T18:51:44.000Z"
 * 			}]	
 * 		]}
 * }
 * 
 * @apiSuccessExample {json} Success	
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": []
 * }
 * 
 * @apiErrorExample {none} Error
 * {
 * 
 * }
*/ 

/**
 * API DELETE
 * @api {delete} /todo-list/:listId Delete Todo List by Todo List Id
 * @apiName DeleteTodoList
 * @apiGroup Todo List
 * @apiParam {Number} listId Todo list id
 * @apiSuccess {none} none
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK"
 *  }
 *@apiErrorExample {none} Error
 * {
 * 
 * }
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