import { Route } from "@core/interfaces";
import { Router } from "express";
import usersController from "./users.controller";

export default class UsersRoute implements Route {
    public path = '/api/users/register';
    public router = Router();

    public usersController = new usersController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, this.usersController.register); //POST http://localhost:5000/api/users/register
    }
}