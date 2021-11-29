import { Route } from '@core/interfaces';
import { authMiddleware } from '@core/middleware';
import validationMiddleware from '@core/middleware/validation.middleware';
import { uploadFileMiddleware } from '@core/middleware';
import { Router } from 'express';
import ClassroomsController from './classrooms.controller';
import CreateDto from './dtos/create.dto';

export default class ClassroomsRoute implements Route {
  public path = '/api/classrooms';
  public router = Router();

  public classroomsController = new ClassroomsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(CreateDto, true),
      authMiddleware,
      this.classroomsController.create
    );

    this.router.get(
      `${this.path}/get`,
      authMiddleware,
      this.classroomsController.getDetail
    );

    this.router.get(
      `${this.path}/get_list_user`,
      authMiddleware,
      this.classroomsController.listUserInClassroom
    );

    this.router.get(
      `${this.path}/get_list_classroom_by_user`,
      authMiddleware,
      this.classroomsController.listClassroomByUserId
    );


    this.router.get(
      `${this.path}/list_classroom`,
      this.classroomsController.listClassroom
    );

    this.router.post(
      `${this.path}/create_classroom_invitation_link`,
      authMiddleware,
      this.classroomsController.createClassroomInvitationLink
    );

    this.router.get(
      `${this.path}/join_in_classroom`,
      this.classroomsController.joinInClassroom
    );

    this.router.post(
      `${this.path}/send_classroom_invitation_link`,
      authMiddleware,
      this.classroomsController.sendClassroomInvitationLink
    );

    this.router.post(
      `${this.path}/upload_file_list_students`,
      authMiddleware,
      uploadFileMiddleware.single("file"),
      this.classroomsController.uploadListStudents
    )

    this.router.get(
      `${this.path}/download_file_template_list_students`,
      this.classroomsController.downloadFileTemplateListStudents
    )
  }
}
