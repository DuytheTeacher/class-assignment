export default interface CommentResponseInterface {
  _id: string;
  auth: Student;
  content: string;
  createAt: Date;
}
interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  account_name: string;
  email: string;
  avatar: string;
}
