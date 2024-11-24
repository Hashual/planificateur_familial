import { Router } from 'express';
import { createTodoList, deleteTodoList, getAllTodoLists, getTodoListById } from '../models/todo/todoList';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { getTodoListTasks } from '../models/todo/todoListTask';
import todoListTasksRoutes from './todoListTasks.routes';

const router = Router();

router.get('/', async (req, res) => {
    const todoList = await getAllTodoLists();

    res.status(200).json({ code: 200, message: 'Success', data: todoList });
});

router.post('/', handler({
	body: z.object({
		title: z.string()
	}),
	handler: async (req, res) => {
		const { title } = req.body;

		const todoListId = await createTodoList(title);
		const todoList = await getTodoListById(todoListId)!;

		res.status(200).json({ code: 200, message: 'Success', data: todoList });
	}
}))

router.get('/:listId', handler({
	params: z.object({
		listId: z.coerce.number().int()
	}),
    handler: async (req, res) => {
		const { listId } = req.params;
		const todoList = await getTodoListById(listId);

		if (!todoList) {
			res.status(404).json({ code: 404, message: 'Not Found' });
			return;
		}

		const tasks = await getTodoListTasks(listId);

		res.status(200).json({ code: 200, message: 'Success', data: { ...todoList, tasks } });
	}
}));

router.delete('/:listId', handler({
	params: z.object({
		listId: z.coerce.number().int()
	}),
	handler: async (req, res) => {
		const { listId } = req.params;
		const todoList = await getTodoListById(listId);

		if (!todoList) {
			res.status(404).json({ code: 404, message: 'Not Found' });
			return;
		}

		await deleteTodoList(listId);

		res.status(200).json({ code: 200, message: 'Success' });
	}
}))

router.use('/:listId/tasks', todoListTasksRoutes);

export default router;