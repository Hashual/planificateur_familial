import { Router } from 'express';
import { createTodoList, getAllTodoLists, getTodoListById } from '../models/todo/todoList';
import { handler } from '../utils/handler';
import { z } from 'zod';

const router = Router();

router.get('/', async (req, res) => {
    const todoList = await getAllTodoLists();

    res.status(200).json({ code: 200, message: 'Success', data: todoList });
});

router.all('/:listId*', handler({
    params: {
        listId: z.coerce.number().int()
    },
    handler: async (req, res, next) => {
        const { listId } = req.params;

        const todoList = await getTodoListById(listId);
        if (!todoList) {
            return res.status(404).json({ code: 404, message: 'Not Found' });
        } 
        await next();
    }
}));

router.get('/:listId', handler({
    params: {
        listId: z.coerce.number().int()
    },
    handler: async (req, res) => {
		if (res.headersSent) { return; }

        const { listId } = req.params;
        const todoList = await getTodoListById(listId)!;

        res.status(200).json({ code: 200, message: 'Success', data: todoList });
    }
}));

router.post('/', handler({
	body: z.object({
		title: z.string()
	}),
	handler: async (req, res) => {
		const { title } = req.body;
		const todoListId = await createTodoList(title);
		const todoList = await getTodoListById(todoListId)!;

		res.status(200).json({ code: 200, message: 'Created', data: todoList });
	}
}))

export default router;