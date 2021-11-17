import axios from 'axios';

const API_URL = 'https://classroom-midterm.herokuapp.com/api/users';

const register = async (body) => {
    const reqBody = {
        ...body,
        account_name: body.username,
        first_name: body.firstName,
        last_name: body.lastName,
        user_type: body.userType
    };
    const resp = await axios.post(`${API_URL}/register`, reqBody);
    return resp;
  };

const exportedObject = {
  register
};

export default exportedObject;