import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
	{
		groupTitle: {
			type: String,
		},
		members: {
			type: Array,
		},
		lastMessage: {
			type: String,
		},
		lastMessageId: {
			type: String,
		},
	},
	{ timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
