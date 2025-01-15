import { Router } from 'express';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { createTodoListTask, deleteTodoListTask, getTodoListTasks, updateTodoListTask } from '../models/todo/todoListTask';	
import { TODO_LIST_ID_TYPE, todoListIdMiddleware } from '../middlewares/todo/todoList.middleware';
import { TODO_LIST_TASK_ID_TYPE, todoListTaskIdMiddleware } from '../middlewares/todo/todoListTask.middleware';
import HttpError from '../utils/exceptions/HttpError';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const router = Router();

/** API GET 
 * @api {get} /api/todo-lists/:listId/tasks/:taskId Get a task 
 * @apiName Get a task
 * @apiGroup Todo list task
 * @apiDescription This function allow you to get a task by his id.
 * @apiParam {Number} listId Todo list id
 * @apiParam {Number} taskId Todo list task id
 * @apiSuccess {Object} data Todo list task
 * @apiSuccess {Number} data.id Todo list task id
 * @apiSuccess {Number} data.todoListId Todo list id
 * @apiSuccess {String} data.title Todo list task title
 * @apiSuccess {Date} data.dueDate Todo list task due date
 * @apiSuccess {Date} data.completedDate Todo list task completed date
 * @apiSuccess {Date} data.createdAt Todo list task creation date
 * @apiSuccess {Date} data.updatedAt Todo list task update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 * 		"id": 1,
 *		"todoListId": 1,
 *  		"title": "Todo list task 1",
 * 		"dueDate": "2025-01-07T18:51:44.000Z",
 * 		"completedDate": "2025-01-07T18:51:44.000Z",
 * 		"createdAt": "2025-01-07T18:51:44.000Z",
 * 		"updatedAt": "2025-01-07T18:51:44.000Z"
 * 		}]
 * }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 * 		"id": 1,
 *		"todoListId": 1,
 *  	"title": "Todo list task 1",
 * 		"dueDate": null,
 * 		"completedDate": null,
 * 		"createdAt": "2025-01-07T18:51:44.000Z",
 * 		"updatedAt": "2025-01-07T18:51:44.000Z"
 * 		}]
 * }
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

/** API POST
 * @api {post} /api/todo-lists/:listId/tasks Create a task
 * @apiName Create a task
 * @apiGroup Todo list task
 * @apiDescription This function allow you to create a task in a todo list.
 * @apiParam {Number} listId Todo list id
 * @apiBody {String} title Todo list task title
 * @apiBody {Date} dueDate Todo list task due date
 * @apiBody {Date} completedDate Todo list task completed date
 * @apiSuccess {Object} data Todo list tasks
 * @apiSuccess {Number} data.id Todo list task id
 * @apiSuccess {Number} data.todoListId Todo list id
 * @apiSuccess {String} data.title Todo list task title
 * @apiSuccess {Date} data.dueDate Todo list task due date
 * @apiSuccess {Date} data.completedDate Todo list task completed date
 * @apiSuccess {Date} data.createdAt Todo list task creation date
 * @apiSuccess {Date} data.updatedAt Todo list task update date
 * @apiSuccessExample {json} Success
 * // If the todo list has multiples tasks
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *  	"id": 1,
 * 		"todoListId": 1,
 * 		"title": "Todo list task 1",
 * 		"dueDate": "2025-01-07T18:51:44.000Z",
 * 		"completedDate": "2025-01-07T18:51:44.000Z",
 * 		"createdAt": "2025-01-07T18:51:44.000Z",
 * 		"updatedAt": "2025-01-07T18:51:44.000Z"
 * 		}, {
 * 		"id": 2,
 * 		"todoListId": 1,
 * 		"title": "Todo list task 2",
 * 		"dueDate": "2025-01-07T18:51:44.000Z",
 * 		"completedDate": "2025-01-07T18:51:44.000Z",
 * 		"createdAt": "2025-01-07T18:51:44.000Z",
 * 		"updatedAt": "2025-01-07T18:51:44.000Z"
 * 		}]
 * }
 * @apiSuccessExample {json} Success
 * // If the todo list has only one task
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 * 		"id": 1,
 * 		"todoListId": 1,
 * 		"title": "Todo list task 1",
 * 		"dueDate": null,
 * 		"completedDate": null,
 * 		"createdAt": "2025-01-07T18:51:44.000Z",
 * 		"updatedAt": "2025-01-07T18:51:44.000Z"
 * 		}]
 * }
 * @apiErrorExample {none} Error
 * {
 * 
 * }
 */

/** API PUT
 * @api {put} /api/todo-lists/:listId/tasks/:taskId Update a task
 * @apiName Update a task
 * @apiGroup Todo list task
 * @apiDescription This function allow you to update a task in a todo list, by his id.
 * @apiParam {Number} listId Todo list id
 * @apiParam {Number} taskId Todo list task id
 * @apiBody {String} title Todo list task title
 * @apiBody {Date} dueDate Todo list task due date
 * @apiBody {Number} isComplete Todo list task is complete
 * @apiSuccess {Object} data Todo list
 * @apiSuccess {Number} data.id Todo list id
 * @apiSuccess {String} data.title Todo list title
 * @apiSuccess {Date} data.createdAt Todo list creation date
 * @apiSuccess {Date} data.updatedAt Todo list update date
 * @apiSuccess {Object[]} data.tasks Todo list tasks
 * @apiSuccess {Number} data.tasks.id Todo list task id
 * @apiSuccess {Number} data.tasks.todoListId Todo list id
 * @apiSuccess {String} data.tasks.title Todo list task title
 * @apiSuccess {Date} data.tasks.dueDate Todo list task due date
 * @apiSuccess {Date} data.tasks.completedDate Todo list task completed date
 * @apiSuccess {Date} data.tasks.createdAt Todo list task creation date
 * @apiSuccess {Date} data.tasks.updatedAt Todo list task update date
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
 * 		}]
 * }
 * @apiErrorExample {none} Error
 * {
 * 
 * } 
 */

/** API DELETE
 * @api {delete} /api/todo-lists/:listId/tasks/:taskId Delete a task
 * @apiName Delete a task
 * @apiGroup Todo list task
 * @apiDescription This function allow you to delete a task in a todo list, by his id.
 * @apiParam {Number} listId Todo list id
 * @apiParam {Number} taskId Todo list task id
 * @apiSuccess {Object} data Todo list 
 * @apiSuccess {Number} data.id Todo list id
 * @apiSuccess {String} data.title Todo list title
 * @apiSuccess {Date} data.createdAt Todo list creation date
 * @apiSuccess {Date} data.updatedAt Todo list update date
 * @apiSuccessExample {json} Success
 * // If the todo list has multiples tasks
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": {[
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
 *  * @apiSuccessExample {json} Success
 * // If the todo list has only one task
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": {[
 * 		"id": 1,
 * 		"title": "Todo list 1",
 * 		"createdAt": "2025-01-07T18:51:44.000Z",
 * 		"updatedAt": "2025-01-07T18:51:44.000Z",
 * 		"tasks": []
 * 		]}
 * }
 *  * @apiSuccessExample {json} Success
 * // If the todo list has no tasks
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": {[
 * 		"id": 1,
 * 		"title": "Todo list 1",
 * 		"createdAt": "2025-01-07T18:51:44.000Z",
 * 		"updatedAt": "2025-01-07T18:51:44.000Z",
 * 		"tasks": []
 * 		]}
 * }
 * @apiErrorExample {none} Error
 * {
 * 
 * }
 */

router.get('/:listId/tasks/:taskId', handler({
	use: [todoListIdMiddleware, todoListTaskIdMiddleware],
	params: z.object({
		listId: TODO_LIST_ID_TYPE,
		taskId: TODO_LIST_TASK_ID_TYPE
	}),
	handler: async (req, res) => {
		const { task } = req;

		res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: task });
	}
}))

// make dueDate and completedDate date type
router.post('/:listId/tasks', handler({
	use: todoListIdMiddleware,
	params: {
		listId: TODO_LIST_ID_TYPE,
	},
	body: z.object({
		title: z.string(),
		dueDate: z.string().optional().nullable(),
		completedDate: z.string().optional().nullable()
	}),
	handler: async (req, res) => {
		
		const { title, dueDate } = req.body;

		const { todoList } = req;

		const dueDateConverted = dueDate ? new Date(dueDate) : null;
		
		await createTodoListTask(todoList.id, title, dueDateConverted);
		const newTasks = await getTodoListTasks(todoList.id);

		res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: newTasks });
	}
}))

router.put('/:listId/tasks/:taskId', handler({
	use: [todoListIdMiddleware, todoListTaskIdMiddleware],
	params: z.object({
		listId: TODO_LIST_ID_TYPE,
		taskId: TODO_LIST_TASK_ID_TYPE
	}),
	body: z.object({
		title: z.string(),
		dueDate: z.string().optional().nullable(),
		completedDate: z.string().optional().nullable(),
	}),
	handler: async (req, res) => {
		const { todoList, task } = req;
		const { title, dueDate, completedDate } = req.body;

		const date = dueDate ? new Date(dueDate) : null;
		const updated = await updateTodoListTask(task.id, title, date, completedDate ? new Date(completedDate) : null);
		if (!updated) {
			throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update todo');
		}

		const updatedTodo = await getTodoListTasks(todoList.id);

		res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: updatedTodo });
	}
}))

router.delete('/:listId/tasks/:taskId', handler({
	use: [todoListIdMiddleware, todoListTaskIdMiddleware],
	params: z.object({
		listId: TODO_LIST_ID_TYPE,
		taskId: TODO_LIST_TASK_ID_TYPE
	}),
	handler: async (req, res) => {
		const { task, todoList } = req;

		await deleteTodoListTask(task.id);

		const updatedTodo = await getTodoListTasks(todoList.id);

		res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: updatedTodo });
	}
}))

export default router;