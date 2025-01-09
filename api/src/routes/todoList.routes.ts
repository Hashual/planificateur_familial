import { Router } from 'express';
import { createTodoList, deleteTodoList, getAllTodoLists, getTodoListById } from '../models/todo/todoList';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { getTodoListTasks } from '../models/todo/todoListTask';
import * as todoListTasksRoutes from './todoListTasks.routes';
import { TODO_LIST_ID_TYPE, todoListIdMiddleware } from '../middlewares/todo/todoList.middleware';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { isConnectedMiddleware } from '../middlewares/auth/isConnected.middleware';

const router = Router();

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