import { Request } from "express";
import { getShoppingListArticleById } from "../../models/shoppingList/shoppingListArticle";
import HttpError from "../../utils/exceptions/HttpError";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import {shoppingListIdMiddleware} from "./shoppingList.middleware";

export const shoppingListArticleIdMiddleware = async (req: Request) => {
    const newReq = await shoppingListIdMiddleware(req);

    const { listId, articleId } = req.params;
    const articleIdInt = parseInt(articleId);
    const shoppingListIdInt = parseInt(listId);

    const article = await getShoppingListArticleById(articleIdInt);
    if (!article || article.shoppingListId != shoppingListIdInt) {
        throw new HttpError(StatusCodes.NOT_FOUND, 'Shopping List Article not found');
    }

    return Object.assign(newReq, { article });
}

export const SHOPPING_LIST_ARTICLE_ID_TYPE = z.coerce.number().int();
export const SHOPPING_LIST_QUANTITY_TYPE = z.number().int().positive();
export const SHOPPING_LIST_COMPLETED_TYPE = z.string().optional().nullable();