import express, { Request, Response } from 'express';

import * as todoListRoutes from './routes/todoList.routes';
import * as shoppingListRoutes from './routes/shoppingList.routes';

import { connection, RunScripts } from './db';
import { ZodError } from 'zod';


const cors = require('cors');
const app = express();

// log all requests
app.use((req, res, next) => {
	console.log(`${req.method} ${req.path}`);
	console.log(req.params);
	next();
})

app.use(express.json());
app.use(cors());
app.use('/todo-list', todoListRoutes.default);
app.use('/shopping-list', shoppingListRoutes.default);

app.use((err: Error, req: Request, res: Response, next: Function) => {
	if (err instanceof ZodError) {
		res.status(400).json({ code: 400, message: 'Bad Request', errors: err.errors });
		return;
	} else {
		console.log(err);
		res.status(500).json({ code: 500, message: 'Internal Server Error' });
	}
})

app.use((req, res) => {
	if (!res.headersSent) {
		res.status(404).send({ code: 404, message: 'Not Found' });
	}
})

app.listen(3000, () => {
	console.log('Server is running on port 3000');
})

connection.addListener('connect', () => {
	RunScripts();
})