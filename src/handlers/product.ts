import {Request, Response} from 'express';
import Product from '../models/Product.model';
import {putMsgErrors} from '../data/Errors';

export const getProducts = async (req: Request, res: Response) => {
	try {
		const products = await Product.findAll({
			order: [['name', 'ASC']],
		});
		res.json({data: products});
	} catch (error) {
		console.error(error);
	}
};

export const getProductById = async (req: Request, res: Response) => {
	try {
		const {id} = req.params;
		const product = await Product.findByPk(id);

		if (!product) {
			return res.status(404).json({
				errors: [
					{
						type: 'field',
						value: id,
						msg: 'Producto no encontrado',
						path: 'id',
						location: 'params',
					},
				],
			});
		}

		res.json({data: product});
	} catch (error) {
		console.error(error);
	}
};

export const createProduct = async (req: Request, res: Response) => {
	try {
		const product = await Product.create(req.body);
		res.status(201).json({data: product});
	} catch (error) {
		console.error(error);
	}
};

export const updateProduct = async (req: Request, res: Response) => {
	try {
		const {id} = req.params;
		const product = await Product.findByPk(id);

		if (!product) {
			return res.status(404).json({
				errors: [
					{
						type: 'field',
						value: id,
						msg: putMsgErrors[9],
						path: 'id',
						location: 'params',
					},
				],
			});
		}

		// Update
		await product.update(req.body);
		await product.save();
		res.json({data: product});
	} catch (error) {
		console.error(error);
	}
};

export const updateAvailability = async (req: Request, res: Response) => {
	try {
		const {id} = req.params;
		const product = await Product.findByPk(id);

		if (!product) {
			return res.status(404).json({
				errors: [
					{
						msg: 'Producto no encontrado',
						type: 'field',
						value: id,
						path: 'id',
						location: 'params',
					},
				],
			});
		}

		// Update availability
		let availability: boolean = !product.dataValues.availability;

		if (
			'availability' in req.body &&
			typeof req.body.availability === 'boolean'
		) {
			availability = req.body.availability;
		}
		product.availability = availability;

		await product.save();
		res.json({data: product});
	} catch (error) {
		console.error(error);
	}
};

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const {id} = req.params;
		const product = await Product.findByPk(id);

		if (!product) {
			return res.status(404).json({
				errors: [
					{
						type: 'field',
						value: id,
						msg: 'Producto no encontrado',
						path: 'id',
						location: 'params',
					},
				],
			});
		}

		// Delete
		await product.destroy();
		res.json({data: 'Producto eliminado'});
	} catch (error) {
		console.error(error);
	}
};
