import express, { Request, Response } from 'express';

import * as todoListRoutes from './routes/todoList.routes';

import { RunScripts } from './db';
import { ZodError } from 'zod';

const app = express();

app.use(express.json());
app.use('/todo-list', todoListRoutes.default);

app.use((err: Error, req: Request, res: Response, next: Function) => {
	if (err instanceof ZodError) {
		res.status(400).json({ code: 400, message: 'Bad Request', errors: err.errors });
		return;
	} else  {
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

RunScripts();