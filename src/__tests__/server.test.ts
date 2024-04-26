import request from 'supertest';
import server, {connectDB} from '../server';
import db from '../config/db';

// Create a mock for the database configuration module
jest.mock('../config/db');

// Test the database connection handling
describe('Connect DB', () => {
	it('Should handle database connection error', async () => {
		// Mock the database authentication method to force a connection error
		jest
			.spyOn(db, 'authenticate')
			.mockRejectedValueOnce(
				new Error('An error occurred while connecting to the db')
			);
		// Spy on console.log to capture the error message
		const consoleSpy = jest.spyOn(console, 'log');
		// Attempt to establish a database connection
		await connectDB();
		// Verify that the expected error message is logged to the console
		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining('An error occurred while connecting to the db')
		);
	});
});
