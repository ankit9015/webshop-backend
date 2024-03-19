import mongoose, { Schema } from "mongoose";

export const productReviewSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	rating: {
		type: Number,
	},
	comment: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

export const ProductReview = mongoose.model(
	"ProductReview",
	productReviewSchema
);
