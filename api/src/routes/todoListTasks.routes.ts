import { Router } from 'express';
import { createTodoList, deleteTodoList, getAllTodoLists, getTodoListById } from '../models/todo/todoList';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { createTodoListTask, getTodoListTaskById, getTodoListTasks, updateTodoListTask } from '../models/todo/todoListTask';

const router = Router();

router.post('/', handler({
	params: z.object({
		listId: z.coerce.number().int()
	}),
	body: z.object({
		title: z.string(),
		date: z.date().optional()
	}),
	handler: async (req, res) => {
		const { listId } = req.params;
		const { title, date } = req.body;

		const todoList = await getTodoListById(listId);
		if (!todoList) {
			res.status(404).json({ code: 404, message: 'Not Found' });
			return;
		}

		const newTodoId = await createTodoListTask(listId, title, date);
		const newTodo = await getTodoListTasks(listId)!;

		res.status(200).json({ code: 200, message: 'Success', data: newTodo });
	}
}))

router.put('/:taskId', handler({
	params: z.object({
		taskId: z.coerce.number().int()
	}),
	body: z.object({
		title: z.string(),
		date: z.date().optional(),
		isComplete: z.boolean()
	}),
	handler: async (req, res) => {
		const { taskId } = req.params;
		const { title, date, isComplete } = req.body;

		const todo = await getTodoListTaskById(taskId);
		if (!todo || todo.todoListId !== taskId) {
			res.status(404).json({ code: 404, message: 'Not Found' });
			return;
		}

		const updated = await updateTodoListTask(taskId, title, date, isComplete);
		if (!updated) {
			res.status(500).json({ code: 500, message: 'Failed to update' });
			return;
		}

		const updatedTodo = await getTodoListTasks(todo.todoListId)!;
		
		res.status(200).json({ code: 200, message: 'Success', data: updatedTodo });
	}
}))

router.delete('/:taskId', handler({
	params: z.object({
		taskId: z.coerce.number().int()
	}),
	handler: async (req, res) => {
		const { taskId } = req.params;

		const todo = await getTodoListTaskById(taskId);
		if (!todo) {
			res.status(404).json({ code: 404, message: 'Not Found' });
			return;
		}

		await deleteTodoList(taskId);
		
		res.status(200).json({ code: 200, message: 'Success' });
	}
}))

export default router;