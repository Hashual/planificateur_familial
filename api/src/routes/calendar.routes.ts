import { Router } from 'express';
import {
    createCalendar,
    deleteCalendar,
    getAllCalendars,
    getCalendarById,
    updateCalendar
} from '../models/calendar/calendar';
import { getCalendarEvents } from '../models/calendar/calendarEvent';
import { handler } from '../utils/handler';
import { z } from 'zod';
import * as calendarEventsRoutes from './calendarEvent.routes';
import { CALENDAR_ID_TYPE, calendarIdMiddleware } from '../middlewares/calendar/calendar.middleware';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { isConnectedMiddleware } from '../middlewares/auth/isConnected.middleware';

const router = Router();



router.get('/', handler({
    use: isConnectedMiddleware,
    handler: async (req, res) => {
        const { user } = req;
        const calendar = await getAllCalendars(user);

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: calendar });
    }
}))

router.post('/', handler({
    body: z.object({
        title: z.string()
    }),
    use: isConnectedMiddleware,
    handler: async (req, res) => {
        const { user } = req;
        const { title } = req.body;

        const calendarId = await createCalendar(title, user);
        const calendar = await getCalendarById(calendarId)!;

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: calendar });
    }
}))

router.put('/:calendarId', handler({
    params: z.object({
        calendarId: CALENDAR_ID_TYPE
    }),
    use: calendarIdMiddleware,
    body: z.object({
        title: z.string()
    }),
    handler: async (req, res) => {
        const { calendar } = req;
        const { title } = req.body;

        await updateCalendar(calendar.id, title);

        const updatedCalendar = await getCalendarById(calendar.id);

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: updatedCalendar });
    }
}))

router.get('/:calendarId', handler({
    params: z.object({
        listId: CALENDAR_ID_TYPE
    }),
    use: calendarIdMiddleware,
    handler: async (req, res) => {
        const { calendar } = req;

        const events = await getCalendarEvents(calendar.id);

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK, data: { ...calendar, events } });
    }
}));

router.delete('/:calendarId', handler({
    params: z.object({
        listId: CALENDAR_ID_TYPE
    }),
    use: calendarIdMiddleware,
    handler: async (req, res) => {
        const { calendar } = req;

        await deleteCalendar(calendar.id);

        res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: ReasonPhrases.OK });
    }
}))

router.use('/', calendarEventsRoutes.default);

export default router;