import { Request } from "express";
import { getCalendarEventById } from "../../models/calendar/calendarEvent";
import HttpError from "../../utils/exceptions/HttpError";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import {calendarIdMiddleware} from "./calendar.middleware";

export const calendarEventIdMiddleware = async (req: Request) => {
    const newReq = await calendarIdMiddleware(req);

    const { calendar } = newReq;
    const { eventId } = newReq.params;
    const event = await getCalendarEventById(parseInt(eventId));

    if (!event) {
        throw new HttpError(StatusCodes.NOT_FOUND, 'Event not found');
    }

    if (event.calendarId !== calendar.id) {
        throw new HttpError(StatusCodes.FORBIDDEN, 'Forbidden');
    }

    return Object.assign(newReq, { event });
}

export const CALENDAR_EVENT_ID_TYPE = z.coerce.number().int();