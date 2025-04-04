import { Router } from 'express';
import { google } from "googleapis";
import { createUser, getUserByEmail, getUserByProvider, UserProvider } from '../models/user/user';
import { createSessionForUser, getSessionById } from '../models/sessions/sessions';
import dotenv from 'dotenv';

dotenv.config();


const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
)

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

	let user = await getUserByProvider(UserProvider.Google, data.id!);
	if (!user) {
		const userByMail = await getUserByEmail(data.email!);
		if (userByMail) {
			res.redirect(`${finalAuthUrl}?error=accountAlreadyExists`);
			return;
		}

		await createUser({
			email: data.email!,
			password: null,
			firstName: data.given_name!,
			lastName: data.family_name!,
			avatarUrl: data.picture!,
			provider: UserProvider.Google,
			providerId: data.id!
		})

		user = await getUserByProvider(UserProvider.Google, data.id!);
	}

	if (!user) {
		res.status(500).send({ code: 500, message: 'Failed to create user' });
		return;
	}

	const sessionTokenId = await createSessionForUser(user);
	if (!sessionTokenId) {
		res.status(500).send({ code: 500, message: 'Failed to create session' });
		return;
	}

	const session = await getSessionById(sessionTokenId);
	if (!session) {
		res.status(500).send({ code: 500, message: 'Failed to get session' });
		return;
	}

	res.redirect(`${finalAuthUrl}?token=${session.token}`);
})

export default router;