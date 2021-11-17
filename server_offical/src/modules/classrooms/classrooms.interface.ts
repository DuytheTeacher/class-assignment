const { ObjectId } = require("mongoose").Types;

export default interface Classroom {
    _id: string;
    name: string;
    auth: Auth;
    description: string;
    thumbnail: string;
    backdrop: string;
    participants_id: Array<typeof ObjectId>;
    createTime: Date;
}

interface Auth {
    auth_id: string,
    name: string,
}