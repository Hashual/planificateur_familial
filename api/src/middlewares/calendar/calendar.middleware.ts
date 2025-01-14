import { Request } from "express";
import { getCalendarById } from "../../models/calendar/calendar";
import HttpError from "../../utils/exceptions/HttpError";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import {isConnectedMiddleware} from "../auth/isConnected.middleware";

export const calendarMiddleware = async (req: Request) => {
    const newReq = await isConnectedMiddleware(req);

    const { user } = newReq;
    const { calendarId } = newReq.params;
    const calendar = await getCalendarById(parseInt(calendarId));

    if (!calendar) {
        throw new HttpError(StatusCodes.NOT_FOUND, 'Calendat List not found');
    }

    if (calendar.ownerId !== user.id) {
        throw new HttpError(StatusCodes.FORBIDDEN, 'Forbidden');
    }

    return Object.assign(newReq, { calendar });
}

export const CALENDAR_ID_TYPE = z.coerce.number().int();