import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
	{
		chat: {
			type: Schema.types.ObjectId,
			ref: "Chat",
		},
		text: {
			type: String,
		},
		sender: {
			type: String,
		},
		images: {
			public_id: {
				type: String,
			},
			url: {
				type: String,
			},
		},
	},
	{ timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
