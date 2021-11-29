const { ObjectId } = require('mongoose').Types;

export default interface ScoreInterface {
    _id: string;
    name: string;
    studentId: string;
    classId: string;
    gradesStructId: string;
    score: number;
    ordinal: number;
    createAt: Date;
    updateAt: Date;
}