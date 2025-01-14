import { Router } from 'express';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { createCalendarEvent, deleteCalendarEvent, getCalendarEventById, getCalendarEvents, updateCalendarEvent } from '../models/calendar/calendarEvent';	
import { CALENDAR_ID_TYPE, calendarIdMiddleware } from '../middlewares/calendar/calendar.middleware';
import { CALENDAR_EVENT_ID_TYPE, calendarEventIdMiddleware } from '../middlewares/calendar/event.middleware';
import HttpError from '../utils/exceptions/HttpError';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const router = Router();

router.get('/:calendarId/events/:eventId', handler({
    use: [calendarIdMiddleware, calendarEventIdMiddleware],
    params: z.object({
        listId: CALENDAR_ID_TYPE,
        taskId: CALENDAR_EVENT_ID_TYPE
    }),
    handler: async (req, res) => {
        const { event } = req;

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: event });
    }
}))

router.post('/:calendarId/events', handler({
    use: calendarIdMiddleware,
    params: z.object({
        calendarId: CALENDAR_ID_TYPE
    }),
    body: z.object({
        calendarId: z.number(),
        title: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        color: z.string().nullable(),
        isReccurent: z.boolean()
    }),
    handler: async (req, res) => {
        const { calendar } = req;
        const { title, description, startDate, endDate, color, isReccurent } = req.body;

        await createCalendarEvent( calendar.id, title, description, startDate, endDate, color, isReccurent);
        const events = await getCalendarEvents(calendar.id);

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: events });
    }
}))

router.put('/:calendarId/events/:eventId', handler({
    use : [calendarIdMiddleware, calendarEventIdMiddleware],
    params: z.object({
        calendarId: CALENDAR_ID_TYPE,
        eventId: CALENDAR_EVENT_ID_TYPE
    }),
    body: z.object({
        title: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        color: z.string().nullable(),
        isReccurent: z.boolean()
    }),
    handler: async (req, res) => {
        const { event } = req;
        const { title, description, startDate, endDate, color, isReccurent } = req.body;

        await updateCalendarEvent(event.id, title, description, startDate, endDate, color, isReccurent);
        const updatedEvent = await getCalendarEventById(event.id);

        if(!updatedEvent) {
            throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update event.');
        }

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: updatedEvent });
    }
}));

router.delete('/:calendarId/events/:eventId', handler({
    use: [calendarIdMiddleware, calendarEventIdMiddleware],
    params: z.object({
        calendarId: CALENDAR_ID_TYPE,
        eventId: CALENDAR_EVENT_ID_TYPE
    }),
    handler: async (req, res) => {
        const { event } = req;

        await deleteCalendarEvent(event.id);

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK });
    }
}));

export default router;