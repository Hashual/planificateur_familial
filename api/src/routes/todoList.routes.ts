import { Router } from 'express';
import {
	createTodoList,
	deleteTodoList,
	getAllTodoLists,
	getTodoListById,
	updateTodoList
} from '../models/todo/todoList';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { getTodoListTasks } from '../models/todo/todoListTask';
import * as todoListTasksRoutes from './todoListTasks.routes';
import { TODO_LIST_ID_TYPE, todoListIdMiddleware } from '../middlewares/todo/todoList.middleware';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { isConnectedMiddleware } from '../middlewares/auth/isConnected.middleware';

const router = Router();

/** API GET
 * @api {get} /todo-list Get all todo lists
 * @apiName Get all todo lists
 * @apiGroup Todo list
 * @apiDescription This function allow you to get all the todo lists.
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
 * @api {post} /todo-list Create a Todo List
 * @apiName Create a Todo List
 * @apiGroup Todo list
 * @apiDescription This function allow you to create a todo list.
 * @apiParam {none} none
 * @apiBody {String} title Todo list title
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

/** API PUT
 * @api {put} /todo-list/:listId Update a todo list 
 * @apiName Update a todo list
 * @apiGroup Todo list
 * @apiDescription This function allow you to update a todo list by his id.
 * @apiParam {Number} listId Todo list id
 * @apiBody {String} title Todo list title
 * @apiSuccess {Object} data Todo list
 * @apiSuccess {Number} data.id Todo list id
 * @apiSuccess {String} data.title Todo list title
 * @apiSuccess {Date} data.createdAt Todo list creation date
 * @apiSuccess {Date} data.updatedAt Todo list update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 * "code": 200,
 * "message": "OK",
 * "data": {
 * 		"id": 1,
 * 		"title": "Todo list 1",
 * 		"createdAt": "2025-01-07T18:51:44.000Z",
 * 		"updatedAt": "2025-01-07T18:51:44.000Z"
 * 		}
 * 	}
 *  @apiErrorExample {none} Error
 *  {
 *  "code": 404,
 *  "message": "Not Found"
 *  }
 *
**/

/** API GET
 * @api {get} /todo-list/:listId Get the todo list tasks 
 * @apiName Get the todo list tasks 
 * @apiGroup Todo list
 * @apiDescription This function allow you to get all the todo list tasks, returned in a list.
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
 * 				"id": 1,
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

/** API DELETE
 * @api {delete} /todo-list/:listId Delete a todo list  
 * @apiName Delete a todo list
 * @apiGroup Todo list
 * @apiDescription This function allow you to delete a todo list by his id.
 * @apiParam {Number} listId Todo list id
 * @apiSuccess {none} none
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK"
 *  }
 * @apiErrorExample {none} Error
 * {
 *  "code": 400,
 *  "message": "Bad Request"
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
		const todoList = await getAllTodoLists(user);

		res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: todoList });
	}
}))

router.post('/', handler({
	body: z.object({
		title: z.string()
	}),
	use: isConnectedMiddleware,
	handler: async (req, res) => {
		const { user } = req;
		const { title } = req.body;

		const todoListId = await createTodoList(title, user);
		const todoList = await getTodoListById(todoListId)!;

		res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: todoList });
	}
}))

router.put('/:listId', handler({
	params: z.object({
		listId: TODO_LIST_ID_TYPE
	}),
	use: todoListIdMiddleware,
	body: z.object({
		title: z.string()
	}),
	handler: async (req, res) => {
		const { todoList } = req;
		const { title } = req.body;

		await updateTodoList(todoList.id, title);

		const updatedTodoList = await getTodoListById(todoList.id);

		res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: updatedTodoList });
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