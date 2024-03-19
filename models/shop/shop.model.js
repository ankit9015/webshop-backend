import mongoose, { Schema } from "mongoose";
import { addressSchema } from "../address.model.js";

const shopSchema = new Schema({
	name: {
		type: String,
		required: [true, "Please enter your shop name!"],
	},
	description: {
		type: String,
	},
	address: {
		type: addressSchema,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	avatar: {
		type: String,
		required: true,
	},
	withdrawMethod: {
		type: Object,
	},
	availableBalance: {
		type: Number,
		default: 0,
	},
	transactions: [
		{
			type: Schema.Types.ObjectId,
			ref: "Transaction",
		},
	],
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

export const Shop = mongoose.model("Shop", shopSchema);
