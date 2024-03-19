import mongoose, { Schema } from "mongoose";

const withdrawSchema = new Schema({
	seller: {
		type: Object,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
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

export default mongoose.model("Withdraw", withdrawSchema);
