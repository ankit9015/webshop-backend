import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
	cloud_name: "ankit9015",
	api_key: "385534975511328",
	api_secret: "Fc09wZwIedTc-pNbIzJn1tXueos",
	secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
	try {
		if (!localFilePath) return null;
		//upload the file on cloudinary
		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
		});
		// file has been uploaded successfull
		// console.log("file is uploaded on cloudinary ", response.url);
		// fs.unlinkSync(localFilePath);
		return response;
	} catch (error) {
		// console.log("error", error);
		// fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
		return null;
	}
};

async function deleteImageFromCloudinary(imageUrl) {
	try {
		// Extract the public ID from the image URL
		const publicId = cloudinary.url(imageUrl).split("/").pop().split(".")[0];

		// Delete the image using the public ID
		const result = await cloudinary.uploader.destroy(publicId);

		console.log(result);
		// The result will contain information about the deletion status
	} catch (error) {
		console.error(error);
	}
}

export { uploadOnCloudinary, deleteImageFromCloudinary };
