import { Router } from "express";
import authService from "../services/authService.js";
import { AUTH_COOKIE_NAME } from "../constants.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";

const authController = Router();

authController.get("/register", isGuest, (req, res) => {
    res.render("auth/register", { title: "Register Page" });
});

authController.post("/register", isGuest, async (req, res) => {
    const { username, email, password, rePassword } = req.body;

    try {
        const token = await authService.register(username, email, password, rePassword);

        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });

        res.redirect("/");
    } catch (err) {
        //const error = getErrorMessage(err);
        res.render("auth/register", { title: "Register Page", username, email, error: getErrorMessage(err) });
    }
});

authController.get("/login", isGuest, (req, res) => {
    res.render("auth/login", { title: "Login Page" });
});

authController.post("/login", isGuest, async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await authService.login(email, password);

        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });

        res.redirect("/");
    } catch (err) {
        res.render("auth/login", { title: "Login Page", email, error: getErrorMessage(err) });
    }
});

authController.get("/logout", isAuth, (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);

    res.redirect("/");
});

export default authController;