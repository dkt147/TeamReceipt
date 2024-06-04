import express from "express";
import AuthService from "../Services/AuthenticationService.js";
const authRouter = express();

const authService = new AuthService();
authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const response = await authService.signup({ name, email, password });
    return res.json(response);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ status: "fail", message: err.message });
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await authService.signin({ email, password });
    return res.json(response);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ status: "fail", message: err.message });
  }
});

authRouter.put("/passwordRecovery", async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await authService.passwordRecovery({ email, password });
    return res.json(response);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ status: "fail", message: err.message });
  }
});

export default authRouter;
