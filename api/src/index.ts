import express, { Request, Response } from 'express';

import todoListRoutes from './routes/todoList.routes';
import shoppingListRoutes from './routes/shoppingList.routes';
import GoogleAuthRoutes from './routes/auth.google.routes';
import LocalAuthRoutes from './routes/auth.local.routes';
import UserRoutes from './routes/user.routes';
import NotificationRoutes from './routes/notifications.routes';
import { connection, RunScripts } from './db';
import { ZodError } from 'zod';
import session from 'express-session';
import HttpError from './utils/exceptions/HttpError';
import dotenv from 'dotenv';
import { Load } from './services/notifications';

dotenv.config();

const cors = require('cors');
const app = express();

// log all requests
// TODO: Add response status
app.use((req, res, next) => {
	console.log(`${req.method} ${req.path}`);
	console.log(req.params);
	next();
})

app.use(express.json());
app.use(cors());

app.set('trust proxy', 1);
app.use(session({
  secret: process.env.COOKIE_SECRET ?? 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}))

app.use('/auth/google', GoogleAuthRoutes);
app.use('/auth/local', LocalAuthRoutes);

// TODO: Rename routes to add 's' & /api/v1 prefix
app.use('/todo-list', todoListRoutes);
app.use('/shopping-list', shoppingListRoutes);
app.use('/users', UserRoutes);
app.use('/notifications', NotificationRoutes);

Load();

app.use((err: Error, req: Request, res: Response, next: Function) => {
	if (err instanceof ZodError) {
		res.status(400).json({ code: 400, message: 'Bad Request', errors: err.errors });
		return;
	} else if (err instanceof HttpError) {
		res.status(err.status).json({ code: err.status, message: err.message });
		return;
	} else {
		console.log(err);
		res.status(500).json({ code: 500, message: 'Internal Server Error' });
	}
})

app.use((_req, res) => {
	if (!res.headersSent) {
		res.status(404).send({ code: 404, message: 'Route Not Found' });
	}
})

app.listen(3000, () => {
	console.log('Server is running on port 3000');
})

connection.addListener('connect', () => {
	RunScripts();
})
