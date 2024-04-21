import {Router} from 'express'
import {body, param} from 'express-validator'
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    updateAvailability,
    deleteProduct,
} from './handlers/product'
import {handleInputErrors} from './middlewares'

const router = Router()

// Routing
router.get('/products', getProducts)

router.get(
    '/product/:id',
    // Validations
    param('id')
        .isInt()
        .withMessage('ID no valido')
        .custom(val => val > 0)
        .withMessage('ID no valido'),
    handleInputErrors,
    getProductById
)

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
        .custom(val => val > 0)
        .withMessage('El precio no es valido'),
    handleInputErrors,
    createProduct
)

router.put(
    '/product/:id',
    // Validations
    param('id')
        .isInt()
        .withMessage('ID no valido')
        .custom(val => val > 0)
        .withMessage('ID no valido'),
    body('name')
        .isString()
        .withMessage('El nombre debe ser un texto')
        .notEmpty()
        .withMessage('El nombre es obligatorio'),
    body('price')
        .isNumeric()
        .withMessage('El precio debe ser un valor número')
        .notEmpty()
        .withMessage('El precio es obligatorio')
        .custom(val => val > 0)
        .withMessage('El precio no es valido'),
    body('availability')
        .isBoolean()
        .withMessage('Valor para disponibildiad no válido'),
    handleInputErrors,
    updateProduct
)

router.patch(
    '/product/:id',
    // Validations
    param('id')
        .isInt()
        .withMessage('ID no valido')
        .custom(val => val > 0)
        .withMessage('ID no valido'),
    handleInputErrors,
    updateAvailability
)

router.delete(
    '/product/:id',
    deleteProduct,
    // Validations
    param('id')
        .isInt()
        .withMessage('ID no valido')
        .custom(val => val > 0)
        .withMessage('ID no valido'),
    handleInputErrors
)

export default router
