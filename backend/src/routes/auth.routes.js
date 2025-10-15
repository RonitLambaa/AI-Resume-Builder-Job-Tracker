import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator, userLoginValidator } from "../validators/index.js";
import { getCurrentUser, login, logout, registerUser, refreshAccessToken } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.get("/me", verifyJWT, getCurrentUser);
router.route("/register").post(userRegisterValidator(), validate, registerUser)
router.route("/login").post(userLoginValidator(), validate, login)
router.post("/refresh-token", refreshAccessToken)
router.route("/logout").post(verifyJWT,logout);




export default router