import {Router} from 'express';
import {body, param} from 'express-validator';
import {
	createProduct,
	getProducts,
	getProductById,
	updateProduct,
	updateAvailability,
	deleteProduct,
} from './handlers/product';
import {handleInputErrors} from './middlewares';
import {putMsgErrors} from './data/Errors';

const router = Router();

// Models Documentation
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The Product ID
 *           example: 1
 *         name:
 *           type: string
 *           description: The Product Name
 *           example: Iphone 15
 *         price:
 *           type: number
 *           format: float
 *           description: The Product Price
 *           example: 500.35
 *         availability:
 *           type: boolean
 *           description: The Product Availability
 *           example: false
 *           default: true
 */

// Routing
// Get documentation
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get a list of products
 *     tags:
 *       - Products
 *     description: Return a list of products
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

router.get('/products', getProducts);

// Get by ID documentation
/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     description: Return a product based on its unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: the ID of the product to retrieve
 *         required: true
 *         schema:
 *             type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request - Invalid ID
 */

router.get(
	'/product/:id',
	// Validations
	param('id')
		.isInt()
		.withMessage('El ID debe ser un número entero')
		.custom((val: number) => val > 0)
		.withMessage('El ID debe ser un número positivo'),
	handleInputErrors,
	getProductById
);

// Create documentation
/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product by ID
 *     tags:
 *       - Products
 *     description: Return a new record in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Iphone 15 Mini"
 *               price:
 *                 type: number
 *                 example: 399
 *               availability:
 *                 type: boolean
 *                 example: true
 *                 required: false
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad Request - invalid input data
 */

router.post(
	'/product',
	// Validations
	body('name')
		.isString()
		.withMessage('El nombre debe ser un texto')
		.notEmpty()
		.withMessage('El nombre es obligatorio'),
	body('price')
		.isNumeric()
		.withMessage('El precio debe ser un valor numérico')
		.notEmpty()
		.withMessage('El precio es obligatorio')
		.custom((val: number) => val > 0)
		.withMessage('El precio no es valido'),
	handleInputErrors,
	createProduct
);

// Update documentation
/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Updates a product with user input
 *     tags:
 *       - Products
 *     description: Return the updated product
 *     parameters:
 *       - in: path
 *         name: id
 *         description: the ID of the product to retrieve
 *         required: true
 *         schema:
 *             type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Iphone 15 Pro Max"
 *               price:
 *                 type: number
 *                 example: 399
 *               availability:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request - invalid input data
 *       404:
 *         description: Not Found
 */

router.put(
	'/product/:id',
	// Validations
	param('id')
		.isInt()
		.withMessage(putMsgErrors[1])
		.custom((val: number) => val > 0)
		.withMessage(putMsgErrors[2]),
	body('name')
		.isString()
		.withMessage(putMsgErrors[3])
		.notEmpty()
		.withMessage(putMsgErrors[4]),
	body('price')
		.isNumeric()
		.withMessage(putMsgErrors[5])
		.notEmpty()
		.withMessage(putMsgErrors[6])
		.custom((val: number) => val > 0)
		.withMessage(putMsgErrors[7]),
	body('availability').isBoolean().withMessage(putMsgErrors[8]),
	handleInputErrors,
	updateProduct
);

// Update availability documentation
/**
 * @swagger
 * /api/product/{id}:
 *   patch:
 *     summary: Updates the availability of a product with user input
 *     tags:
 *       - Products
 *     description: Return an availability updated
 *     parameters:
 *       - in: path
 *         name: id
 *         description: the ID of the product to retrieve
 *         required: true
 *         schema:
 *             type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availability:
 *                 type: boolean
 *                 example: true
 *                 required: false
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request - invalid input data
 *       404:
 *         description: Not Found
 */

router.patch(
	'/product/:id',
	// Validations
	param('id')
		.isInt()
		.withMessage('El ID debe ser un número entero')
		.custom((val: number) => val > 0)
		.withMessage('El ID debe ser un número positivo'),
	body('availability')
		.optional()
		.isBoolean()
		.withMessage('La disponibilidad es un valor booleano'),
	handleInputErrors,
	updateAvailability
);

// Delete documentation
/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Products
 *     description: Remove a product based on its unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: the ID of the product to delete
 *         required: true
 *         schema:
 *             type: integer
 *     responses:
 *       200:
 *         description:
 *           application/json:
 *             schema:
 *               type: string
 *               value: 'Producto eliminado'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request - Invalid ID
 */

router.delete(
	'/product/:id',
	// Validations
	param('id')
		.isInt()
		.withMessage('El ID debe ser un número entero')
		.custom((val: number) => val > 0)
		.withMessage('El ID debe ser un número positivo'),
	handleInputErrors,
	deleteProduct
);

export default router;
