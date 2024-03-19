import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
	createShop,
	getCurrentShop,
	updateShopAddress,
	updateShopAvatar,
	updateShopDetails,
} from "../controllers/shop.controller.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create").post(upload.single("avatar"), createShop);
router.route("/get-shop/:shopId").get(getCurrentShop);
router.route("/update-avatar/:shopId").post(upload.single("avatar"), updateShopAvatar);
router.route("/update-details/:shopId").post(updateShopDetails);
router.route("/update-address/:shopId").post(updateShopAddress);

export default router;
