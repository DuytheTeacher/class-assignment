import axios from 'axios';
import api from './api';

const randomImageUrl = 'https://source.unsplash.com/1600x900/?study,education';

const getListClassrooms = async () => {
  const resp = await api.get('/classrooms/get_list_classroom_by_user');
  return resp.data.payload.class_list_id;
};

const getRandomImage = async () => {
  try {
    const response = await axios.get(randomImageUrl);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const createClass = async (data) => {
  try {
    const randomImage = await getRandomImage();
    const response = await api.post('/classrooms/create', {
      ...data,
      thumbnail: randomImage.request.responseURL,
      backdrop: randomImage.request.responseURL,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

const getClassDetail = async (id) => {
  try {
    const resp = await api.get(`/classrooms/get?id=${id}`);
    return resp.data.payload;
  } catch (error) {
    return error.response;
  }
};

const getListParticipants = async (classID) => {
  try {
    const resp = await api.get(`/classrooms/get_list_user?id=${classID}`);
    return resp.data.payload;
  } catch (error) {
    return error.response;
  }
};

const getGradeStructure = async (classID) => {
  try {
    const resp = await api.get(`/gradestructure/get/?classId=${classID}`);
    return resp.data.payload;
  } catch (error) {
    throw error.message;
  }
};

const createGradeStructure = async (classID, newGradesList) => {
  try {
    await api.post(`/gradestructure/create`, {
      classId: classID,
      createGradesStructure: newGradesList
    });
  } catch (error) {
    throw error.message;
  }
};

const updateGradeStructure = async (classID, updatedGradesList) => {
  try {
    await api.put(`/gradestructure/update`, {
      classId: classID,
      updateGradesStructure: updatedGradesList
    });
  } catch (error) {
    throw error.message;
  }
};

const deleteGradeStructure = async (classID, deleteGradesList) => {
  try {
    await api.delete(`/gradestructure/delete`, {
      classId: classID,
      deleteGradesStructure: deleteGradesList
    });
  } catch (error) {
    throw error.message;
  }
};

const uploadListStudent = async (body) => {
  try {
    await api.post(`/classrooms/upload_file_list_students`, body);
  } catch (error) {
    throw error.message;
  }
};

const exportedObject = {
  getListClassrooms,
  createClass,
  getClassDetail,
  getListParticipants,
  getGradeStructure,
  createGradeStructure,
  updateGradeStructure,
  deleteGradeStructure,
  uploadListStudent
};

export default exportedObject;
