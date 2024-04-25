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

// Routing
router.get('/products', getProducts);

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
