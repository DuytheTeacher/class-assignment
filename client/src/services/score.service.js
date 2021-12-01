import api from './api';

const downloadTemplte = async (classID) => {
  try {
    await api.get(`/classrooms/download_file_template_list_students=${classID}`);
  } catch (error) {
    throw error.message;
  }
}

const getListScore = async (classID, studentID) => {
  try {
    const resp = await api.get(`/scores/get_list_scores?classId=${classID}&studentId=${studentID}`);
    return resp.data.payload;
  } catch (error) {
    throw error.message;
  }
}

const exportedObject = {
  downloadTemplte,
  getListScore
};

export default exportedObject;
