import 'dotenv/config';
import App from './app';
import { validateEnv } from '@core/utils';
import { IndexRoute } from '@modules/index';
import UsersRoute from '@modules/users/users.route';
import AuthRoute from '@modules/auth/auth.route';
import ClassroomsRoute from '@modules/classrooms/classrooms.route';
import GradeStructureRoute from '@modules/grade_structure/grade_structure.route';
import ScoresRoute from '@modules/scores/scores.route';

validateEnv();
global.__filename = __dirname + "/.."
const routes = [
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new ClassroomsRoute(),
  new GradeStructureRoute(),
  new ScoresRoute(),

];
const app = new App(routes);

app.listen();
