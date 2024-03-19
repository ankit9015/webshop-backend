import mongoose, { Schema } from "mongoose";
import { productReviewSchema } from "./productReview.model.js";

const productSchema = new Schema({
	name: {
		type: String,
		required: [true, "Please enter your product name!"],
	},
	description: {
		type: String,
		required: [true, "Please enter your product description!"],
	},
	category: {
		type: String,
		required: [true, "Please enter your product category!"],
	},
	tags: {
		type: [String],
	},
	originalPrice: {
		type: Number,
	},
	discountPrice: {
		type: Number,
		required: [true, "Please enter your product price!"],
	},
	stock: {
		type: Number,
		required: [true, "Please enter your product stock!"],
	},
	images: [
		{
			type: String,
			required: true,
		},
	],
	reviews: [
		{ type: Schema.Types.ObjectId, required: true, ref: "ProductReview" },
	],
	ratings: {
		type: Number,
	},
	shop: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Shop",
	},
	sold_out: {
		type: Number,
		default: 0,
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

export const Product = mongoose.model("Product", productSchema);
