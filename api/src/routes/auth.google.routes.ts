import { Router, Request } from 'express';
import { Session } from 'express-session';
import { google } from "googleapis";
import { randomBytes } from 'node:crypto';
import { appendFile } from 'node:fs';

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
)

console.log(process.env.GOOGLE_REDIRECT_URI);

interface CustomSession extends Session {
	state?: string;
}

const router = Router();

const scopes = [
	'https://www.googleapis.com/auth/userinfo.email',
	'https://www.googleapis.com/auth/userinfo.profile'
];

router.get('/login', (req, res) => {
	const state = randomBytes(32).toString('hex');
	(req.session as CustomSession).state = state;

	const authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes,
		state: state
	});

	res.redirect(authUrl);
})

router.get('/callback', async (req, res) => {
	if (req.query.error) {
		res.redirect('/login');
		return;
	}

	const code = req.query.code as string | undefined;
	const state = req.query.state as string | undefined;

	console.log(code, state, (req.session as CustomSession).state);

	if (!code || !state || state !== (req.session as CustomSession).state) {
		res.redirect('/auth/google/login');
		return;
	}

	const { tokens } = await oauth2Client.getToken(code);
	if (!tokens) {
		res.redirect('/auth/google/login');
		return;
	}

	oauth2Client.setCredentials(tokens);

	const oauth2 = google.oauth2({
		auth: oauth2Client,
		version: 'v2'
	});

	const { data } = await oauth2.userinfo.get();

	res.json(data);
})

export default router;