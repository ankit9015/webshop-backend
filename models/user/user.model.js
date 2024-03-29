import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
	fullName: {
		type: String,
		required: [true, "Please enter your name!"],
		trim: true,
		index: true,
	},
	email: {
		type: String,
		required: [true, "Please enter your email!"],
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: [true, "Please enter your password"],
		minLength: [4, "Password should be greater than 4 characters"],
		select: false,
	},

	phoneNumber: {
		type: Number,
	},
	addresses: [{ type: Schema.types.ObjectId, ref: "Address" }],
	role: {
		type: [String],
		enum: ["user", "seller"],
		default: "user",
	},
	avatar: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

//  Hash password
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// jwt token
userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			fullName: this.fullName,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};
userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

// compare password
userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
