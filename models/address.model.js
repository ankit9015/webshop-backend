import mongoose, { Schema } from "mongoose";

export const addressSchema = new Schema({
	country: {
		type: String,
	},
	city: {
		type: String,
	},
	address1: {
		type: String,
	},
	address2: {
		type: String,
	},
	zipCode: {
		type: Number,
	},
});

export const Address = mongoose.model("Address", addressSchema);
