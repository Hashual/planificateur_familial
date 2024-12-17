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
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes
	});

	res.status(200).send({
		code: 200,
		data: { authUrl }
	})
})

router.get('/callback', async (req, res) => {
	if (req.query.error) {
		res.redirect('/login');
		return;
	}

	const code = req.query.code as string | undefined;
	
	// The state will be the final redirection url with the token
	const finalAuthUrl = req.query.state as string | undefined;

	if (!code || !finalAuthUrl) {
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
	console.log(data);

	res.redirect(`${finalAuthUrl}?token=FINAL_TOKEN`);
})

export default router;