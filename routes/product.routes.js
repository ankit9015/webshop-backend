import { Router } from "express";
import {
	createProductReview,
	createShopProduct,
	deleteShopProducts,
	getProduct,
	getProductReviews,
	getProducts,
	getShopProducts,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
	"/get-products", // "/get-products?category&sortOrder&sortBy&page&pageSize"
	getProducts
);
router.get(
	"/:productId", 
	getProduct
);
router.get("/get-shop-products/:shopId", verifyJWT, getShopProducts); // "category&sortOrder&sortBy&page&pageSize"
router.post("/create-shop-product/:shopId", verifyJWT, createShopProduct);
router.delete("/delete-shop-product/:shopId/:productId", verifyJWT, deleteShopProducts);

router.get("/get-product-reviews/:productId", getProductReviews); // "category&sortOrder&sortBy&page&pageSize"
router.post("/create-product-review/:productId", verifyJWT, createProductReview);

export default router;
