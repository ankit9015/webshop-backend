import { Order } from "../models/order/order.model";
import { Product } from "../models/product/product.model";
import { ApiError } from "../services/general/ApiError";

// create order
export const createOrder = asyncHandler(async (req, res, next) => {
	// validate shop details
	// validate product details
	// create product

	const order = new Order(req.body);
	order.user = req.user.userId;

	const { items } = req.body;
	order.items = items;
	order.totalPrice = items.reduce((total, currentItem) => {
		const price = currentItem.discountPrice * currentItem.count;
		total = total + price;
		return total;
	}, 0);

	await order.save();

	return res
		.status(201)
		.json(new ApiResponse(200, product, "Product created successfully"));
});

// update order
export const upsertItemInCart = asyncHandler(async (req, res, next) => {
	const cartOrder = await Order.findOne({
		user: req.user.id,
		status: "created",
	}).populate("items.product");

	const { item } = req.body;

	const itemIndex = cartOrder.items.findIndex(
		(x) => x.product.id == item.product.id
	);
	if (itemIndex >= 0) {
		cartOrder.items[itemIndex].count = item.count;
	} else {
		cartOrder.items.push(item);
	}
	cartOrder.totalPrice = cartOrder.items.reduce((total, currentItem) => {
		const price = currentItem.discountPrice * currentItem.count;
		total = total + price;
		return total;
	}, 0);

	await cartOrder.save();

	return res
		.status(201)
		.json(new ApiResponse(201, cartOrder, "Cart successfully"));
});

// remove Item from cart
export const removeItemFromCart = asyncHandler(async (req, res, next) => {
	const cartOrder = await Order.findOne({
		user: req.user.id,
		status: "created",
	}).populate("items.product");

	const itemIndex = cartOrder.items.findIndex(
		(x) => x.product.id == req.params.productId
	);

	if (itemIndex < 0) {
		throw new ApiError(404, "Product not found in Cart");
	}

	cartOrder.items.splice(itemIndex, 1);
	cartOrder.totalPrice = cartOrder.items.reduce((total, currentItem) => {
		const price = currentItem.discountPrice * currentItem.count;
		total = total + price;
		return total;
	}, 0);
	await cartOrder.save();

	return res
		.status(201)
		.json(new ApiResponse(201, cartOrder, "Cart successfully"));
});

// get cart order
export const getCart = asyncHandler(async (req, res, next) => {
	const cartOrder = await Order.findOne({
		user: req.user.id,
		status: "created",
	}).populate("items.product");

	return res
		.status(200)
		.json(new ApiResponse(200, cartOrder, "Cart successfully"));
});

// get all orders
export const getOrders = asyncHandler(async (req, res) => {
	const { page = 1, pageSize = 20 } = req.query;

	let query = Order.find().populate("items.product");

	query = query.sort({ [sortBy]: sortOrder == "asc" ? 1 : -1 });

	const totalCount = query.count();

	let orders = query.skip((page - 1) * pageSize);
	const limitReached = orders.length > pageSize;

	orders = orders.limit(pageSize).exec();

	const to_ret = {
		orders,
		nextPage: ++page,
		limitReached,
		totalCount,
	};

	return res
		.status(200)
		.json(new ApiResponse(200, to_ret, "Products fetched successfully"));
});

// get order
export const getOrder = asyncHandler(async (req, res) => {
	const order = await Order.findOne({
		user: req.user.id,
		id: req.params.orderId,
	})
		.populate("items.product")
		.exec();

	if (!order) {
		throw new ApiError(404, "Order not found");
	}
	return res
		.status(200)
		.json(new ApiResponse(200, order, "Order fetched successfully"));
});

// update order address
export const updateOrderAddress = asyncHandler(async (req, res, next) => {
	const { orderId } = req.params;

	const order = await Order.findOne({
		user: req.user.id,
		id: orderId,
	}).populate("shippingAddress");

	if (!order) {
		throw new ApiError(404, "Not Found");
	}

	if (!["created", "pending", "paid"].includes(order.status)) {
		throw new ApiError(
			405,
			"Can not change the shipping address for your order"
		);
	}

	order.shippingAddress = req.params.addressId;

	await order.save();

	return res
		.status(200)
		.json(new ApiResponse(200, order, "Shipping address updated successfully"));
});
