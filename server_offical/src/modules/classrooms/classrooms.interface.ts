// const { ObjectId } = require("mongoose").Types;

export default interface Classroom {
    _id: string;
    name: string;
    description: string;
    user: Array<string>;
    createTime: Date;
}