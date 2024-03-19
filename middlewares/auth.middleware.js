import { ApiError } from "../services/general/ApiError.js";
import { asyncHandler } from "../services/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
	const token =
		req.cookies?.accessToken ||
		req.header("Authorization")?.replace("Bearer ", "");

	// console.log(token);
	if (!token) {
		throw new ApiError(401, "Unauthorized request");
	}

	const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

	const user = await User.findById(decodedToken?._id).select(
		"-password -refreshToken"
	);

	if (!user) {
		throw new ApiError(401, "Invalid Access Token");
	}

	req.user = user;
	next();
});