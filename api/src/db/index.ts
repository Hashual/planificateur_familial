import { readdirSync, readFileSync } from 'fs';
import { createConnection, QueryError, QueryResult } from 'mysql2';
import { join } from 'path';

console.log(process.env);

export const connection = createConnection({
	host: process.env.SQL_HOST,
	user: process.env.SQL_USER,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE,
	charset: "utf8mb4"
})

connection.connect((err) => {
	if (err) {
		console.error('Database connection failed: ' + err.stack);
		return;
	}
	console.log('Connected to database.');
})

export const SqlQuery = <T extends QueryResult>(sql: string, values?: any) => {
	return new Promise<T>((resolve, reject) => {
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