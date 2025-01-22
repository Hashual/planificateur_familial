import { readdirSync, readFileSync } from 'fs';
import { createConnection, QueryError, QueryResult } from 'mysql2';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const connection = createConnection({
	host: process.env.SQL_HOST,
	user: process.env.SQL_USER,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE,
	charset: "utf8mb4",
	multipleStatements: true
})

let isConnected = false;
async function Connect() {
	if (isConnected) {
		return;
	}
	connection.connect((err) => {
		if (err) {
			console.error('Database connection failed: ' + err.stack);
			setTimeout(Connect, 5000);

			return;
		}
		console.log('Connected to database.');

		isConnected = true;
	})
}
Connect();

connection.on( "error", (err) => {
	console.error('Database error: ' + err.stack);
	isConnected = false;
	console.log('Reconnecting in 5 seconds.')
	setTimeout(Connect, 5000);
})

connection.on( "end", () => {
	isConnected = false;
	console.log('Database connection ended.')
	console.log('Reconnecting in 5 seconds.')
	setTimeout(Connect, 5000);
})

export const SqlQuery = <T extends QueryResult>(sql: string, values?: any) => {
	return new Promise<T>((resolve, reject) => {
		if (!isConnected) {
			console.log(`Database not connected, retrying in 5 seconds.`);
			
			setTimeout(() => {
				SqlQuery(sql, values).then( (result) => {
					resolve(result as T);	
				}).catch( (err) => {
					reject(err);
				})
			}, 5000);

			return;
		}

		connection.query(sql, values, (err: QueryError | null, result: T) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(result);
		})
	})
}

export const RunScripts = async () => {
	const scriptsFolder = join(__dirname, 'scripts');
	
	for await (const file of readdirSync(scriptsFolder)) {
		const script = readFileSync(join(scriptsFolder, file)).toString();
		await SqlQuery(script);
	}
}	