import { asyncHandler } from "../services/asyncHandler.js";
import {
	deleteImageFromCloudinary,
	uploadOnCloudinary,
} from "../services/cloudinary.js";
import { ApiError } from "../services/general/ApiError.js";
import { ApiResponse } from "../services/general/ApiResponse.js";
import { Shop } from "../models/shop/shop.model.js";
import { Address } from "../models/address.model.js";

// create shop
export const createShop = asyncHandler(async (req, res) => {
	// get user details from request
	// if user already exist check if emailIsConfirmed -> if yes return user already exists
	// if emailConfirmed is false return Please confirm your email
	// if user doest not exist, validate all the fields
	// create new entry in mongoose
	// verify the user is created
	// return verified user without password and refresh token

	const { name, description, address } = req.body;
	let shop = await Shop.findOne({ name });
	if (shop) {
		throw new ApiError(409, "Shop name already exist");
	}

	const avatarLocalPath = req.files?.avatar[0]?.path;

	if (!avatarLocalPath) {
		throw new ApiError(400, "Avatar file is required");
	}
	const avatar = await uploadOnCloudinary(avatarLocalPath);
	if (!avatar) {
		throw new ApiError(400, "Avatar file is required");
	}

	const seller = {
		name,
		description,
		avatar: avatar.url,
		address,
	};

	shop = await Shop.create(seller);

	const createdShop = await Shop.findById(shop._id)

	if (!createdShop) {
		throw new ApiError(500, "Something went wrong while registering the shop");
	}

	return res
		.status(201)
		.json(new ApiResponse(201, createdShop, "Shop registered Successfully"));
});

// load shop
export const getCurrentShop = asyncHandler(async (req, res) => {
	const { shopId } = req.params;

	const shop = await Shop.findById(shopId).populate("owner").exec();
	if (!shop) {
		throw new ApiError(404, "Shop not found");
	}
	if (shop.owner.id !== req.user.id) {
		throw new ApiError(401, "Unauthorized request");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, shop, "User fetched successfully"));
});

// update shop profile picture
export const updateShopAvatar = asyncHandler(async (req, res) => {
	const { shopId } = req.params;
	const shop = await Shop.findById(shopId).populate("owner").exec();
	if (!shop) {
		throw new ApiError(404, "Shop not found");
	}
	if (shop.owner.id !== req.user.id) {
		throw new ApiError(401, "Unauthorized request");
	}

	const avatarLocalPath = req.file?.path;
	if (!avatarLocalPath) {
		throw new ApiError(400, "Avatar file is missing");
	}

	deleteImageFromCloudinary(shop.avatar);

	const avatar = await uploadOnCloudinary(avatarLocalPath);

	if (!avatar.url) {
		throw new ApiError(400, "Error while uploading on avatar");
	}

	shop = await Shop.findByIdAndUpdate(
		req.shopId,
		{
			$set: {
				avatar: avatar.url,
			},
		},
		{ new: true }
	).select("-password");

	return res
		.status(200)
		.json(new ApiResponse(200, shop, "Avatar image updated successfully"));
});

// update seller info
export const updateShopDetails = asyncHandler(async (req, res) => {
	const { shopId } = req.params;
	let shop = await Shop.findById(shopId).populate("owner").exec();
	if (!shop) {
		throw new ApiError(404, "Shop not found");
	}
	if (shop.owner.id !== req.user.id) {
		throw new ApiError(401, "Unauthorized request");
	}

	const { name, description } = req.body;
	if (!name) {
		throw new ApiError(400, "name cannot be empty");
	}

	shop = await User.findByIdAndUpdate(
		shop.id,
		{
			$set: {
				name,
				description,
			},
		},
		{ new: true }
	).select("-password");

	return res
		.status(200)
		.json(new ApiResponse(200, shop, "Shop details updated successfully"));
});

// update seller info
export const updateShopAddress = asyncHandler(async (req, res) => {
	const { shopId } = req.params;

	let shop = await Shop.findById(shopId).populate("owner").exec();
	if (!shop) {
		throw new ApiError(404, "Shop not found");
	}
	if (shop.owner.id !== req.user.id) {
		throw new ApiError(401, "Unauthorized request");
	}

	const { country, city, address1, address2, zipCode } = req.body;
	if (
		[country, city, address1, address2, zipCode].some(
			(x) => x == undefined || x.trim().length == 0
		)
	) {
		throw new ApiError(400, "Address field can not be empty");
	}

	const address = await Address.findByIdAndUpdate(
		shop.address,
		{
			$set: {
				country,
				city,
				address1,
				address2,
				zipCode,
			},
		},
		{ new: true }
	);
	shop = await Shop.findById(shopId);

	return res
		.status(200)
		.json(new ApiResponse(200, shop, "Shop details updated successfully"));
});
