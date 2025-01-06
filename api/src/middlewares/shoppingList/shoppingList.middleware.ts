import { Request } from "express";
import { getShoppingListById } from "../../models/shoppingList/shoppingList";
import HttpError from "../../utils/exceptions/HttpError";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

export const shoppingListIdMiddleware = async (req: Request) => {
    const { shoppingListId } = req.params;
    const shoppingList = await getShoppingListById(parseInt(shoppingListId));

    if (!shoppingList) {
        throw new HttpError(StatusCodes.NOT_FOUND, 'Shopping List not found');
    }	

    return Object.assign(req, { shoppingList });
}

export const SHOPPING_LIST_ID_TYPE = z.coerce.number().int();