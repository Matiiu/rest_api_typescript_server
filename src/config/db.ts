import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.DB_URL!, {
	dialectOptions: {
		ssl: {
			require: false,
		},
	},
	models: [__dirname + '/../models/**/*.ts'],
	logging: false,
});

export default db;
