import { Request } from "express";
import { getShoppingListArticleById } from "../../models/shoppingList/shoppingListArticle";
import HttpError from "../../utils/exceptions/HttpError";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

export const shoppingListArticleIdMiddleware = async (req: Request) => {
    const { listId, articleId } = req.params;
    const articleIdInt = parseInt(articleId);
    const shoppingListIdInt = parseInt(listId);

    const article = await getShoppingListArticleById(articleIdInt);
    if (!article || article.shoppingListId != shoppingListIdInt) {
        throw new HttpError(StatusCodes.NOT_FOUND, 'Shopping List Article not found');
    }

    return Object.assign(req, { article });
}

export const SHOPPING_LIST_ARTICLE_ID_TYPE = z.coerce.number().int();