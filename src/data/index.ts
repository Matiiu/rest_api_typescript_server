import { exit } from 'node:process';
import db from '../config/db';
import colors from 'colors';

const clearDB = async () => {
	try {
		await db.sync({ force: true });
		console.log(colors.bgMagenta.bold('Data deleted successfully'));
		exit(0);
	} catch (error) {
		console.error(error);
		exit(1);
	}
};

process.argv[2] === '--clear' && clearDB();
