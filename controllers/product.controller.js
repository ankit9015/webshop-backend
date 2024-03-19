import { ApiError } from "../services/general/ApiError.js";
import { ApiResponse } from "../services/general/ApiResponse.js";
import { asyncHandler } from "../services/asyncHandler.js";
import { Product } from "../models/product/product.model.js";
import { Shop } from "../models/shop/shop.model.js";
import { ProductReview } from "../models/product/productReview.model.js";

// get all products
export const getProducts = asyncHandler(async (req, res) => {
	// get products?category&sortOrder&sortBy&page&pageSize
	const {
		page = 1,
		pageSize = 10,
		sortOrder = "asc",
		sortBy = "createdAt",
		category,
		searchQuery = "",
	} = req.query;

	let query = Product.find();
	if (category) {
		query = query.where("category", category);
	}
	if (searchQuery) {
		query = query.where("name", { $regex: searchQuery, $options: "i" });
	}

	query = query.sort({ [sortBy]: sortOrder == "asc" ? 1 : -1 });

	const totalCount = query.count();

	let products = query.skip((page - 1) * pageSize);
	const limitReached = products.length > pageSize;

	products = products.limit(pageSize).exec();

	const to_ret = {
		products,
		nextPage: ++page,
		limitReached,
		totalCount,
	};

	return res
		.status(200)
		.json(new ApiResponse(200, to_ret, "Products fetched successfully"));
});

// get Product
export const getProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.productId).exec();
	if (!product) {
		throw new ApiError(404, "Product not found");
	}
	return res
		.status(200)
		.json(new ApiResponse(200, product, "User fetched successfully"));
});

// create shop product
export const createShopProduct = asyncHandler(async (req, res, next) => {
	// validate shop details
	// validate product details
	// create product

	const shop = await Shop.findById(req.params.shopId).exec();
	if (!shop) {
		throw new ApiError(404, "Shop not found");
	}

	let images = [];

	if (typeof req.body.images === "string") {
		images.push(req.body.images);
	} else {
		images = req.body.images;
	}

	const imagesLinks = [];

	for (let i = 0; i < images.length; i++) {
		const result = await cloudinary.v2.uploader.upload(images[i], {
			folder: "products",
		});

		imagesLinks.push({
			public_id: result.public_id,
			url: result.secure_url,
		});
	}

	const productData = req.body;
	productData.images = imagesLinks;
	productData.shop = shop.shopId;

	const product = await Product.create(productData);

	return res
		.status(201)
		.json(new ApiResponse(200, product, "Product created successfully"));
});

// get all products of a shop
export const getShopProducts = asyncHandler(async (req, res) => {
	// get products?category&sortOrder&sortBy&page&pageSize
	const {
		page = 1,
		pageSize = 10,
		sortOrder = "asc",
		sortBy = "createdAt",
		category,
		searchQuery = "",
	} = req.query;

	const shop = await Shop.findById(req.params.shopId).exec();
	if (!shop) {
		throw new ApiError(404, "Shop not found");
	}

	let query = Product.find({ shopId: req.params.shopId });
	if (category) {
		query = query.where("category", category);
	}
	if (searchQuery) {
		query = query.where("name", { $regex: searchQuery, $options: "i" });
	}

	query = query.sort({ [sortBy]: sortOrder == "asc" ? 1 : -1 });

	const totalCount = query.count();

	let products = query.skip((page - 1) * pageSize);
	const limitReached = products.length > pageSize;

	products = products.limit(pageSize).exec();

	const to_ret = {
		products,
		nextPage: ++page,
		limitReached,
		totalCount,
	};

	return res
		.status(200)
		.json(new ApiResponse(200, to_ret, "Products fetched successfully"));
});

// delete product of a shop
export const deleteShopProducts = asyncHandler(async (req, res, next) => {
	const shop = await Shop.findById(req.params.shopId).exec();
	if (!shop) {
		throw new ApiError(404, "Shop not found");
	}

	const product = await Product.findOne({
		_id: productId,
		shopId,
	});

	if (!product) {
		throw new ApiError(404, "Product not found");
	}

	for (let image of product.images) {
		deleteImageFromCloudinary(image);
	}

	await product.remove();

	return res
		.status(204)
		.json(new ApiResponse(200, product, "Product deleted successfully"));
});

// get product reviews
export const getProductReviews = asyncHandler(async (req, res) => {
	// get product-reviews?category&sortOrder&sortBy&page&pageSize
	const { page = 1, pageSize = 10 } = req.query;

	let query = ProductReview.find();
	const totalCount = query.count();

	let productReviews = query.skip((page - 1) * pageSize);
	const limitReached = productReviews.length > pageSize;

	productReviews = productReviews.limit(pageSize).exec();

	const to_ret = {
		productReviews,
		nextPage: ++page,
		limitReached,
		totalCount,
	};

	return res
		.status(200)
		.json(new ApiResponse(200, to_ret, "Product Reviews successfully"));
});

// create product review
export const createProductReview = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.productId).exec();
	if (!product) {
		throw new ApiError(404, "Product not found");
	}

	const { rating, comment } = req.body;

	let productReview = new ProductReview({
		rating,
		comment,
		product: product.productId,
		user: req.user.id,
	});

	await productReview.save();

	return res
		.status(201)
		.json(new ApiResponse(200, productReview, "Product created successfully"));
});
