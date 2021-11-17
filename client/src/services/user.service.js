import api from './api';

const register = async (body) => {
  const reqBody = {
    ...body,
    account_name: body.username,
    first_name: body.firstName,
    last_name: body.lastName,
    user_type: body.userType,
  };
  const resp = await api.post(`users/register`, reqBody);
  return resp;
};

const getUserDetailById = async (id) => {
  const resp = await api.get(`users/get/${id}`);
  return resp.data.payload;
};

const exportedObject = {
  register,
  getUserDetailById
};

export default exportedObject;
