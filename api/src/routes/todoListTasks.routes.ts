import { Router } from 'express';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { createTodoListTask, deleteTodoListTask, getTodoListTasks, updateTodoListTask } from '../models/todo/todoListTask';	
import { TODO_LIST_ID_TYPE, todoListIdMiddleware } from '../middlewares/todo/todoList.middleware';
import { TODO_LIST_TASK_ID_TYPE, todoListTaskIdMiddleware } from '../middlewares/todo/todoListTask.middleware';
import HttpError from '../utils/exceptions/HttpError';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const router = Router();

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
		isComplete: z.number()
	}),
	handler: async (req, res) => {
		const { todoList, task } = req;
		const { title, dueDate, isComplete } = req.body;

		const date = dueDate ? new Date(dueDate) : null;
		const updated = await updateTodoListTask(task.id, title, date, isComplete === 1);
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