import { Router } from 'express';
import { getAllTodoLists } from '../models/todo/todoList';

const router = Router();

router.get('/', async (req, res) => {
	const todoList = await getAllTodoLists();

	res.status(200).json({ code: 200, message: 'Success', data: todoList });
})

export default router;