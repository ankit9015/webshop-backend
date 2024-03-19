import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/temp");
	},
	filename: function (req, file, cb) {
		console.log(req.body, file, cb);
		cb(null, file.originalname);
	},
});

export const upload = multer({
	storage,
});
