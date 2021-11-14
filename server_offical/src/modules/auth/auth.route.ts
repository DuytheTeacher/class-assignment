import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import AuthController from "./auth.controller";

export default class AuthRoute implements Route {
  public path = "/api/auth";
  public router = Router();

  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.authController.login);

    this.router.get(
      `${this.path}/get`,
      authMiddleware,
      this.authController.getCurrentLoginUser
    );

    this.router.post(`${this.path}/login_google`, this.authController.loginGoogle);
  }
}
