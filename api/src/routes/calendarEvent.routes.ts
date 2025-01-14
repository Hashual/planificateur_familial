import { Router } from 'express';
import { handler } from '../utils/handler';
import { z } from 'zod';
import { createCalendarEvent, deleteCalendarEvent, getCalendarEventById, getCalendarEvents, updateCalendarEvent } from '../models/calendar/calendarEvent';	
import { CALENDAR_ID_TYPE, calendarIdMiddleware } from '../middlewares/calendar/calendar.middleware';
import { CALENDAR_EVENT_ID_TYPE, calendarEventIdMiddleware } from '../middlewares/calendar/event.middleware';
import HttpError from '../utils/exceptions/HttpError';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const router = Router();

/** API GET
 * @api {GET} /:calendarId/events/:eventId
 * @apiName Get calendar event
 * @apiGroup Calendar event
 * @apiDescription Get a calendar event by his id
 * @apiParam {number} calendarId Calendar id
 * @apiParam {number} eventId Event id
 * @apiSuccessExample {json} Success
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": {
 *      "id": 1,
 *      "calendarId": 1,
 *      "title": "Event title",
 *      "description": "Event description",
 *      "startDate": "2021-09-01T00:00:00.000Z",
 *      "endDate": "2021-09-01T00:00:00.000Z",
 *      "color": "#000000",
 *      "isReccurent": false
 * }
 * @apiErrorExample {json} Event not found
 * {
 *  "code": 404,
 *  "message": "Not Found"
 * }
 * @apiErrorExample {json} Internal server error
 * {
 *  "code": 500,
 *  "message": "Internal Server Error"
 * }
 * @apiErrorExample {none} Error
 * {
 * 
 * }
*/

/** API POST 
 * @api {POST} /:calendarId/events
 * @apiName Create calendar event
 * @apiGroup Calendar event
 * @apiDescription Create a new calendar event
 * @apiParam {number} calendarId Calendar id
 * @apiParam {string} title Event title
 * @apiParam {string} description Event description
 * @apiParam {date} startDate Event start date
 * @apiParam {date} endDate Event end date
 * @apiParam {string} color Event color
 * @apiParam {boolean} isReccurent Event is reccurent
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *     "id": 1,
 *     "calendarId": 1,
 *     "title": "Event title",
 *     "description": "Event description",
 *     "startDate": "2021-09-01T00:00:00.000Z",
 *     "endDate": "2021-09-01T00:00:00.000Z",
 *     "color": "#000000",
 *     "isReccurent": false},
 *    {
 *    "id": 2,
 *    "calendarId": 1,
 *    "title": "Event title",
 *    "description": "Event description",
 *    "startDate": "2021-09-01T00:00:00.000Z",
 *    "endDate": "2021-09-01T00:00:00.000Z",
 *    "color": "#000000",
 *    "isReccurent": false
 * }]
 * }
 * @apiErrorExample {json} Event not found
 * {
 *  "code": 404,
 *  "message": "Not Found"
 * }
 * @apiErrorExample {json} Internal server error
 * {
 *  "code": 500,
 *  "message": "Internal Server Error"
 * }
 * @apiErrorExample {none} Error
 * {
 * 
 * }
*/

/** API PUT
 * @api {PUT} /:calendarId/events/:eventId
 * @apiName Update calendar event
 * @apiGroup Calendar event
 * @apiDescription Update a calendar event by his id
 * @apiParam {number} calendarId Calendar id
 * @apiParam {number} eventId Event id
 * @apiParam {string} title Event title
 * @apiParam {string} description Event description
 * @apiParam {date} startDate Event start date
 * @apiParam {date} endDate Event end date
 * @apiParam {string} color Event color
 * @apiParam {boolean} isReccurent Event is reccurent
 * @apiSuccessExample {json} Success
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *    "id": 1,
 *    "calendarId": 1,
 *    "title": "Event title",
 *    "description": "Event description",
 *    "startDate": "2021-09-01T00:00:00.000Z",
 *    "endDate": "2021-09-01T00:00:00.000Z",
 *    "color": "#000000",
 *    "isReccurent": false
 * }]
 * }
 * @apiErrorExample {json} Event not found
 * {
 *  "code": 404,
 *  "message": "Not Found"
 * }
 * @apiErrorExample {json} Internal server error
 * {
 *  "code": 500,
 *  "message": "Internal Server Error"
 * }
 * @apiErrorExample {none} Error
 * {
 * 
 * }
*/

/** API DELETE
 * @api {DELETE} /:calendarId/events/:eventId
 * @apiName Delete calendar event
 * @apiGroup Calendar event
 * @apiDescription Delete a calendar event by his id
 * @apiParam {number} calendarId Calendar id
 * @apiParam {number} eventId Event id
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK"
 * }
 * @apiErrorExample {json} Event not found
 * {
 *  "code": 404,
 *  "message": "Not Found"
 * }
 * @apiErrorExample {json} Internal server error
 * {
 *  "code": 500,
 *  "message": "Internal Server Error"
 * }
 * @apiErrorExample {none} Error
 * {
 * 
 * }
*/

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