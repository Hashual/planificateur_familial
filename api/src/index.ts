import express, { Request, Response } from 'express';

import * as todoListRoutes from './routes/todoList.routes';

const app = express();

app.use(express.json());
app.use('/todo-list', todoListRoutes.default);

app.use((req, res) => {
	res.status(404).send({ code: 404, message: 'Not Found' });
})

app.listen(3000, () => {
	console.log('Server is running on port 3000');
})