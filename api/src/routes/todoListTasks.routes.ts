import { Router } from 'express';
import { createTodoList, deleteTodoList, getAllTodoLists, getTodoListById } from '../models/todo/todoList';
import { handler } from '../utils/handler';
import { z } from 'zod';
import {
	createTodoListTask,
	deleteTodoListTask,
	getTodoListTaskById,
	getTodoListTasks,
	updateTodoListTask
} from '../models/todo/todoListTask';	

const router = Router();

// TODO : fix zod verification on listId   // z.coerce.number().int()
router.post('/', handler({
	params: z.any(),
	body: z.object({
		title: z.string(),
		date: z.date().optional()
	}),
	handler: async (req, res) => {
		console.log("req", req.params, req.body);
		let { listId } = req.params;
		const { title, date } = req.body;

		listId = listId || 1;

/*		const todoList = await getTodoListById(listId);
		if (!todoList) {
			res.status(404).json({ code: 404, message: 'Not Found' });
			return;
		}*/

		const newTodoId = await createTodoListTask(listId, title, date);
		const newTodo = await getTodoListTasks(listId)!;

		res.status(200).json({ code: 200, message: 'Success', data: newTodo });
	}
}))

// TODO : Make dueDate date type
router.put('/:taskId', handler({
	params: z.object({
		taskId: z.coerce.number().int()
	}),
	body: z.object({
		title: z.string(),
		dueDate: z.string().optional(),
		isComplete: z.number()
	}),
	handler: async (req, res) => {
		const { taskId } = req.params;
		const { title, dueDate, isComplete } = req.body;

		const todo = await getTodoListTaskById(taskId);
		if (!todo) {
			res.status(404).json({ code: 404, message: 'Not Found' });
			return;
		}

		const date = dueDate ? new Date(dueDate) : null;
		const updated = await updateTodoListTask(taskId, title, date, isComplete === 1);
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

		await deleteTodoListTask(taskId);

		const updatedTodo = await  getTodoListTasks(todo.todoListId)!;

		res.status(200).json({ code: 200, message: 'Success', data: updatedTodo });
	}
}))

export default router;