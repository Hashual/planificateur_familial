import { Request } from "express";
import { getTodoListById } from "../../models/todo/todoList";
import HttpError from "../../utils/exceptions/HttpError";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { isConnectedMiddleware } from "../auth/isConnected.middleware";

export const todoListIdMiddleware = async (req: Request) => {
	const newReq = await isConnectedMiddleware(req);

	const { user } = newReq;
	const { listId } = newReq.params;
	const todoList = await getTodoListById(parseInt(listId));

	if (!todoList) {
		throw new HttpError(StatusCodes.NOT_FOUND, 'Todo List not found');
	}	

	if (todoList.ownerId !== user.id) {
		throw new HttpError(StatusCodes.FORBIDDEN, 'Forbidden');
	}

	return Object.assign(newReq, { todoList });
}

export const TODO_LIST_ID_TYPE = z.coerce.number().int();