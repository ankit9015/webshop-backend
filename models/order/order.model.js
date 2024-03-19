import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
	product: {
		type: Schema.types.ObjectId,
		ref: "Product",
	},
	count: {
		type: Number,
		required: true,
	},
});

const orderSchema = new Schema({
	items: [orderItemSchema],
	shippingAddress: {
		type: Schema.types.ObjectId,
		ref: "Address",
	},
	user: {
		type: Schema.types.ObjectId,
		ref: "User",
		required: true,
	},
	totalPrice: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		enum: ["created", "pending", "paid", "shipped", "delivered"],
		default: "created",
	},
	paymentInfo: {
		id: {
			type: String,
		},
		status: {
			type: String,
		},
		type: {
			type: String,
		},
	},
	paidAt: {
		type: Date,
		default: Date.now(),
	},
	deliveredAt: {
		type: Date,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	modifiedAt: {
		type: Date,
		default: Date.now(),
	},
});

export const OrderItem = mongoose.model("OrderItem", orderItemSchema);
export const Order = mongoose.model("Order", orderSchema);
