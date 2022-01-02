import { Route } from '@core/interfaces';
import { authMiddleware } from '@core/middleware';
import validationMiddleware from '@core/middleware/validation.middleware';
import { Router } from 'express';
import RegisterDto from './dtos/register.dto';
import UpdateDto from './dtos/update.dto';
import UsersController from './users.controller';

export default class UsersRoute implements Route {
  public path = '/api/users';
  public router = Router();

  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(RegisterDto, true),
      this.usersController.register
    );

    this.router.put(
      `${this.path}/update`,
      validationMiddleware(UpdateDto, true),
      authMiddleware,
      this.usersController.updateUser
    );

    this.router.get(`${this.path}/get/:id`, this.usersController.getUserById);

    this.router.get(
      `${this.path}/get_user_by_email`,
      this.usersController.getUserByEmail
    );

    this.router.post(
      `${this.path}/mapping_studentid`,
      authMiddleware,
      this.usersController.mappingStudentIdWithAccount
    );
    this.router.put(
      `${this.path}/admin/block`,
      authMiddleware,
      this.usersController.blockUser
    );
    this.router.put(
      `${this.path}/admin/unmapping_studentid`,
      authMiddleware,
      this.usersController.unMappStudentIdOfAccount
    );
    this.router.get(
      `${this.path}/admin/get_list_class_by_time`,
      this.usersController.getListClassroomByCreateTime
    );
    this.router.get(
      `${this.path}/admin/get_list_class_by_search`,
      this.usersController.getListClassroomBySearchName
    );
    this.router.get(
      `${this.path}/admin/get_list_user`,
      this.usersController.getListUser
    );
  }
}
