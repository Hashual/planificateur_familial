import { Request } from "express";
import { getTodoListById } from "../models/todo/todoList";
import HttpError from "../utils/exceptions/HttpError";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

export const todoListIdMiddleware = async (req: Request) => {
	const { listId } = req.params;
	const todoList = await getTodoListById(parseInt(listId));

	if (!todoList) {
		throw new HttpError(StatusCodes.NOT_FOUND, 'Todo List not found');
	}	

	return Object.assign(req, { todoList });
}

export const TODO_LIST_ID_TYPE = z.coerce.number().int();