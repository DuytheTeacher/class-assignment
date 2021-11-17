const { ObjectId } = require("mongoose").Types;
export default interface IUser {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    user_type: number;
    reg_type: number;
    mssv: string;
    class_list_id: Array<typeof ObjectId>;
    avatar: string;
    create_at: Date;
    update_at: Date;
}