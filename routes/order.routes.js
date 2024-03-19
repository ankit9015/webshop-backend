import {
	createOrder,
	getCart,
	getOrder,
	getOrders,
	removeItemFromCart,
	updateOrderAddress,
	upsertItemInCart,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.get(
	"/get-orders", // "/get-products?category&sortOrder&sortBy&page&pageSize"
	getOrders
);
router.get("/:orderId", getOrder);
router.get("/get-cart", getCart);
router.post("/create-order", createOrder);
router.post("/upsert-item-in-cart", upsertItemInCart);
router.delete("/remove-item-from-cart/:productId", removeItemFromCart);

router.post("/update-shipping-address/:orderId", updateOrderAddress);

export default router;
