import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema({
	product: {
		type: Schema.types.ObjectId,
		ref: "Product",
	},
	count: {
		type: Number,
		required: true,
	},
});

const cartSchema = new Schema({
	user: {
		type: Schema.types.ObjectId,
		ref: "User",
		required: true,
	},
	products: [cartItemSchema],

	createdAt: {
		type: Date,
		default: Date.now(),
	},
	modifiedAt: {
		type: Date,
		default: Date.now(),
	},
});

export const Cart = mongoose.model("Cart", cartSchema);
