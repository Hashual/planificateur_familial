import { Request } from "express";
import { getShoppingListById } from "../../models/shoppingList/shoppingList";
import HttpError from "../../utils/exceptions/HttpError";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import {isConnectedMiddleware} from "../auth/isConnected.middleware";

export const shoppingListIdMiddleware = async (req: Request) => {
    const newReq = await isConnectedMiddleware(req);

    const { user } = newReq;
    const { listId } = newReq.params;
    const shoppingList = await getShoppingListById(parseInt(listId));

    if (!shoppingList) {
        throw new HttpError(StatusCodes.NOT_FOUND, 'Shopping List not found');
    }

    if (shoppingList.ownerId !== user.id) {
        throw new HttpError(StatusCodes.FORBIDDEN, 'Forbidden');
    }

    return Object.assign(newReq, { shoppingList });
}

export const SHOPPING_LIST_ID_TYPE = z.coerce.number().int();