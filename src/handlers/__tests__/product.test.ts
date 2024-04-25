import request from 'supertest';
import server from '../../server';
import {putMsgErrors} from '../../data/Errors';

const invalidId = 'invalid-id';
const nonExistentId = 9999;

describe('POST /api/products', () => {
	it('Should display validation errors', async () => {
		const res = await request(server).post('/api/product').send({});

		// What should return
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(5);

		// What shouldn't return
		expect(res.status).not.toEqual(201);
		expect(res.status).not.toEqual(404);
	});

	it('Should validate that the price is greater than 0', async () => {
		const body = {
			name: 'Monitor Curvo',
			price: -23,
		};

		const res = await request(server).post('/api/product').send(body);

		// What should return
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0].msg).toBe('El precio no es valido');

		// What shouldn't return
		expect(res.status).not.toEqual(201);
		expect(res.status).not.toEqual(404);
	});

	it('Should validate that the price is equal to a numerical value', async () => {
		const body = {
			name: 'Monitor Curvo',
			price: 'Hello World',
		};

		const res = await request(server).post('/api/product').send(body);

		// What should return
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(2);
		expect(res.body.errors[0].msg).toBe('El precio debe ser un valor numérico');
		expect(res.body.errors[1].msg).toBe('El precio no es valido');

		// What shouldn't return
		expect(res.status).not.toEqual(201);
		expect(res.status).not.toEqual(404);
	});

	it('Should create a new product', async () => {
		const body = {
			name: 'Monitor Curvo - Testing',
			price: 100,
		};

		const res = await request(server).post('/api/product').send(body);

		// What should return
		expect(res.status).toEqual(201);
		expect(res.body).toHaveProperty('data');

		// What shouldn't return
		expect(res.status).not.toBe(400);
		expect(res.status).not.toBe(200);
		expect(res.body).not.toHaveProperty('errors');
	});
});

describe('GET /api/products', () => {
	it('Should check if api/products url exist', async () => {
		const res = await request(server).get('/api/products');
		expect(res.status).not.toBe(404);
	});

	it('GET to JSON response with products', async () => {
		const res = await request(server).get('/api/products');
		expect(res.status).toBe(200);
		expect(res.headers['content-type']).toMatch(/json/);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toHaveLength(1);

		expect(res.body).not.toHaveProperty('errors');
		expect(res.status).not.toBe(404);
	});
});

describe('GET /api/product/:id', () => {
	it('Should return 404 response for a non-existent product', async () => {
		const res = await request(server).get(`/api/product/${nonExistentId}`);
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors[0].msg).toBe('Producto no encontrado');
	});

	it('Should check a valid ID in the URL', async () => {
		const res = await request(server).get(`/api/product/${invalidId}`);
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toHaveLength(2);
		expect(res.body.errors[0].msg).toEqual('El ID debe ser un número entero');
		expect(res.body.errors[1].msg).toEqual('El ID debe ser un número positivo');
	});

	it('Get a JSON response', async () => {
		const res = await request(server).get('/api/product/1');
		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toMatchObject({
			id: expect.any(Number),
			name: expect.any(String),
			price: expect.any(Number),
			availability: expect.any(Boolean),
		});
	});
});

describe('PUT api/product/:id', () => {
	it('Should display validation error messages when updating a product', async () => {
		const res = await request(server).put(`/api/product/${invalidId}`).send({});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toBeTruthy();
		expect(res.body.errors).toHaveLength(8);

		for (const [key, val] of Object.entries(putMsgErrors)) {
			const keyInt = +key - 1;
			if (keyInt < 8) {
				expect(res.body.errors[keyInt].msg).toBe(val);
			}
		}

		expect(res.body).not.toHaveProperty('data');
		expect(res.status).not.toEqual(200);
	});

	it('Should display validation error messages when updating a product', async () => {
		const res = await request(server).put('/api/product/1').send({
			name: 'Iphone 15 Pro Max',
			price: -3500,
			availability: true,
		});

		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toBeTruthy();
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0].msg).toBe(putMsgErrors[7]);

		expect(res.body).not.toHaveProperty('data');
		expect(res.status).not.toEqual(200);
	});

	it('Should display an error message when a product is not found', async () => {
		const res = await request(server).put('/api/product/5').send({
			name: 'Iphone 15 Pro Max',
			price: 3500,
			availability: true,
		});

		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toBeTruthy();
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0].msg).toBe(putMsgErrors[9]);

		expect(res.body).not.toHaveProperty('data');
		expect(res.status).not.toEqual(200);
	});

	it('Should display an error message when the availability value is not there', async () => {
		const res = await request(server).put('/api/product/1').send({
			name: 'Iphone Mini',
			price: 3500,
		});

		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toBeTruthy();
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0].msg).toBe(putMsgErrors[8]);

		expect(res.body).not.toHaveProperty('data');
		expect(res.status).not.toEqual(200);
	});

	it('Should update the product ', async () => {
		const updateProduct = {
			name: 'Iphone Mini',
			price: 3500,
			availability: true,
		};
		const res = await request(server)
			.put('/api/product/1')
			.send({
				...updateProduct,
			});

		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toMatchObject({
			id: expect.any(Number),
			name: updateProduct.name,
			price: updateProduct.price,
			availability: updateProduct.availability,
		});

		expect(res.body).not.toHaveProperty('errors');
		expect(res.status).not.toEqual(404);
	});
});

describe('PATCH api/product/:id', () => {
	it('Should display error message when the ID is not found', async () => {
		const res = await request(server).patch(`/api/product/${nonExistentId}`);
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toBeTruthy();
		expect(res.body.errors).toHaveLength(1);
		expect(res.body.errors[0].msg).toBe('Producto no encontrado');

		expect(res.body).not.toHaveProperty('data');
		expect(res.status).not.toEqual(200);
	});

	it('Should display an errors messages when the ID is invalid', async () => {
		const res = await request(server).patch(`/api/product/${invalidId}`);

		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors).toBeTruthy();
		expect(res.body.errors).toHaveLength(2);
		expect(res.body.errors[0].msg).toBe('El ID debe ser un número entero');
		expect(res.body.errors[1].msg).toBe('El ID debe ser un número positivo');

		expect(res.body).not.toHaveProperty('data');
		expect(res.status).not.toEqual(200);
	});

	it('Should return an error message when the availability is not a boolean value', async () => {
		const res = await request(server).patch('/api/product/1').send({
			availability: 'hello',
		});

		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors[0].msg).toBe(
			'La disponibilidad es un valor booleano'
		);

		expect(res.body).not.toHaveProperty('data');
		expect(res.status).not.toEqual(200);
	});

	it('Should update the availability with the value sent', async () => {
		const availability = false;

		const res = await request(server).patch('/api/product/1').send({
			availability,
		});

		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toMatchObject({
			availability,
		});

		expect(res.body).not.toHaveProperty('errors');
		expect(res.status).not.toEqual(404);
	});

	it('Should update the availability', async () => {
		const res = await request(server).patch('/api/product/1');

		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('data');

		expect(res.body).not.toHaveProperty('errors');
		expect(res.status).not.toEqual(404);
	});
});

describe('DELETE api/product/:id', () => {
	it('Should check a valid ID', async () => {
		const res = await request(server).delete(`/api/product/${invalidId}`);
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors[0].msg).toEqual('El ID debe ser un número entero');
		expect(res.body.errors[1].msg).toEqual('El ID debe ser un número positivo');

		expect(res.status).not.toEqual(200);
		expect(res.body).not.toHaveProperty('data');
	});

	it('Should return a 404 response for a non-existent product', async () => {
		const res = await request(server).delete(`/api/product/${nonExistentId}`);
		expect(res.status).toEqual(404);
		expect(res.body).toHaveProperty('errors');
		expect(res.body.errors[0].msg).toEqual('Producto no encontrado');

		expect(res.status).not.toEqual(200);
		expect(res.body).not.toHaveProperty('data');
	});

	it('Should remove the product', async () => {
		const res = await request(server).delete('/api/product/1');
		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('data');
		expect(res.headers['content-type']).toMatch(/json/);
		expect(res.body.data).toBe('Producto eliminado');

		expect(res.status).not.toEqual(404);
		expect(res.body).not.toHaveProperty('errors');
	});
});
