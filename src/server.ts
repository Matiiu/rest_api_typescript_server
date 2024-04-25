import express from 'express';
import colors from 'colors';

import router from './router';
import db from './config/db';

// Connect to db
export async function connectDB() {
	try {
		await db.authenticate();
		db.sync();
	} catch (error) {
		console.log(
			colors.bgRed.bold('An error occurred while connecting to the db')
		);
	}
}
connectDB();

// Installation of Express
const server = express();

// Read form data
server.use(express.json());

server.use('/api', router);
server.get('/api', (req, res) => {
	res.json({msg: 'From API'});
});

export default server;
