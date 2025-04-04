import { Request } from "express";
import { getTodoListTaskById } from "../../models/todo/todoListTask";
import HttpError from "../../utils/exceptions/HttpError";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { todoListIdMiddleware } from "./todoList.middleware";

export const todoListTaskIdMiddleware = async (req: Request) => {
	const newReq = await todoListIdMiddleware(req);

	const { listId, taskId } = req.params;
	const taskIdInt = parseInt(taskId);
	const listIdInt = parseInt(listId);
	
	const task = await getTodoListTaskById(taskIdInt);
	if (!task || task.todoListId != listIdInt) {
		throw new HttpError(StatusCodes.NOT_FOUND, 'Todo List Task not found');
	}

	return Object.assign(newReq, { task });
}

export const TODO_LIST_TASK_ID_TYPE = z.coerce.number().int();