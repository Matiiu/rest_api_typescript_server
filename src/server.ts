import express from 'express';
import colors from 'colors';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec, { swaggerUiOptions } from './config/swagger';
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

// Allow connections
const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (origin === process.env.FRONT_END_URL) {
			callback(null, true);
			return;
		}
		callback(new Error('CORS error'));
	},
};

server.use(cors(corsOptions));

// Read form data
server.use(express.json());

server.use(morgan('dev'));

server.use('/api', router);

// Docs
server.use(
	'/docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
