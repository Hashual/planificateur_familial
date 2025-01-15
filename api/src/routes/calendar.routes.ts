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

/** API GET
 * @api {get} /calendar Get all calendars
 * @apiName Get all calendars
 * @apiGroup Calendar
 * @apiDescription This function is used to get all calendars.
 * @apiParam {none} none
 * @apiSuccess {Object[]} data List of calendars
 * @apiSuccess {Number} data.id Calendar id
 * @apiSuccess {String} data.title Calendar title
 * @apiSuccess {Date} data.createdAt Calendar creation date
 * @apiSuccess {Date} data.updatedAt Calendar last update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *     "id": 1,
 *     "title": "Calendrier n°1",
 *     "createdAt": "2025-01-07T18:51:44.000Z",
 *     "updatedAt": "2025-01-07T18:51:44.000Z"}]
 * }
 * @apiSuccessExample {json} Empty
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": []
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "code": 500,
 *  "message": "Internal Server Error"
 * }
 * @apiErrorExample {none} Error
 * HTTP/1.1 
 * {
 * 
 * }
*/

/** API POST
 * @api {post} /calendar Create a calendar
 * @apiName Create a calendar
 * @apiGroup Calendar
 * @apiDescription This function is used to create a calendar.
 * @apiParam {String} title Calendar title
 * @apiSuccess {Object} data Calendar
 * @apiSuccess {Number} data.id Calendar id
 * @apiSuccess {String} data.title Calendar title
 * @apiSuccess {Date} data.createdAt Calendar creation date
 * @apiSuccess {Date} data.updatedAt Calendar update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *    "id": 1,
 *    "title": "Calendrier n°1",
 *    "createdAt": "2025-01-07T18:51:44.000Z",
 *    "updatedAt": "2025-01-07T18:51:44.000Z"}]
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "code": 500,
 *  "message": "Internal Server Error"
 * }
 * @apiErrorExample {none} Error
 * HTTP/1.1 
 * {
 * 
 * }
*/

/** API PUT
 * @api {put} /calendar/:calendarId Update a calendar
 * @apiName Update a calendar 
 * @apiGroup Calendar
 * @apiDescription This function is used to update a calendar.
 * @apiParam {Number} calendarId Calendar id
 * @apiParam {String} title Calendar title
 * @apiSuccess {Object} data Calendar
 * @apiSuccess {Number} data.id Calendar id
 * @apiSuccess {String} data.title Calendar title
 * @apiSuccess {Date} data.createdAt Calendar creation date
 * @apiSuccess {Date} data.updatedAt Calendar update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *    "id": 1,
 *    "title": "Calendrier n°1",
 *    "createdAt": "2025-01-07T18:51:44.000Z",
 *    "updatedAt": "2025-01-07T18:51:44.000Z"}]
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "code": 500,
 *  "message": "Internal Server Error"
 * }
 * @apiErrorExample {none} Error
 * HTTP/1.1
 * {
 * 
 * }
*/

/** API GET
 * @api {get} /calendar/:calendarId Get a calendar 
 * @apiName Get a calendar
 * @apiGroup Calendar
 * @apiDescription This function is used to get a calendar by his id. It also returns all events linked to this calendar.
 * @apiParam {Number} calendarId Calendar id
 * @apiSuccess {Object} data Calendar
 * @apiSuccess {Number} data.id Calendar id
 * @apiSuccess {String} data.title Calendar title
 * @apiSuccess {Date} data.createdAt Calendar creation date
 * @apiSuccess {Date} data.updatedAt Calendar update date
 * @apiSuccess {Object[]} data.events List of events
 * @apiSuccess {Number} data.events.id Event id
 * @apiSuccess {String} data.events.title Event title
 * @apiSuccess {String} data.events.description Event description
 * @apiSuccess {Date} data.events.startDate Event start date
 * @apiSuccess {Date} data.events.endDate Event end date
 * @apiSuccess {String} data.events.color Event color
 * @apiSuccess {Boolean} data.events.isReccurent Event is reccurent
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *      "id": 1,
 *      "title": "Calendrier n°1",
 *      "createdAt": "2025-01-07T18:51:44.000Z",
 *      "updatedAt": "2025-01-07T18:51:44.000Z",
 *      "events": [{
 *            "id": 1,
 *            "title": "Event n°1",
 *            "description": "Description de l'événement",
 *            "startDate": "2025-01-07T18:51:44.000Z",
 *            "endDate": "2025-01-07T18:51:44.000Z",
 *            "color": "#000000",
 *            "isReccurent": false}]
 * }
 * @apiSuccessExample {json} Success 
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK",
 *  "data": [{
 *      "id": 1,
 *      "title": "Calendrier n°1",
 *      "createdAt": "2025-01-07T18:51:44.000Z",
 *      "updatedAt": "2025-01-07T18:51:44.000Z",
 *      "events": [{
 *            "id": 1,
 *            "title": "Event n°1",
 *            "description": "Description de l'événement",
 *            "startDate": "2025-01-07T18:51:44.000Z",
 *            "endDate": "2025-01-07T18:51:44.000Z",
 *            "color": null,
 *            "isReccurent": false}]
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "code": 500,
 *  "message": "Internal Server Error"
 * }
 * @apiErrorExample {none} Error
 * HTTP/1.1
 * {
 * 
 * }
*/

/** API DELETE
 * @api {delete} /calendar/:calendarId Delete a calendar
 * @apiName Delete a calendar
 * @apiGroup Calendar
 * @apiDescription This function is used to delete a calendar by his id.
 * @apiParam {Number} calendarId Calendar id
 * @apiSuccess {none} none
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *  "code": 200,
 *  "message": "OK"
 * }
 * @apiErrorExample {json} List error
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "code": 500,
 *  "message": "Internal Server Error"
 * }
 * @apiErrorExample {none} Error
 * HTTP/1.1
 * {
 * 
 * }
 */

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
        const calendar = await getCalendarById(calendarId);

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