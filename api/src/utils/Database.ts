import { createConnection, QueryError, QueryResult } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const connection = createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
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