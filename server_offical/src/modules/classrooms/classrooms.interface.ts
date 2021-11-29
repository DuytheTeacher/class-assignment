const { ObjectId } = require("mongoose").Types;

interface Classroom {
    _id: string;
    name: string;
    auth: Auth;
    description: string;
    thumbnail: string;
    backdrop: string;
    participants_id: Array<typeof ObjectId>;
    list_students_from_xlsx: Array<Student>;
    createTime: Date;
}

interface Student {
    student_id: string,
    full_name: string,
}

interface Auth {
    auth_id: string,
    name: string,
}

export {Classroom, Student}