import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema({
	amount: {
		type: Number,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	shop: {
		type: Schema.Types.ObjectId,
		ref: "Shop",
	},
	status: {
		type: String,
		default: "Processing",
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
	},
});

export const Transaction = mongoose.model("Transaction", transactionSchema);
