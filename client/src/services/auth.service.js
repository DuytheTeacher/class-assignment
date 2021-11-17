import axios from 'axios';

const API_URL = 'https://classroom-midterm.herokuapp.com/api/auth';

const login = async ({ username, password }) => {
  const resp = await axios.post(`${API_URL}/login`, {
    account_name: username,
    password,
  });

  const tokenData = resp.data.payload;

  if (tokenData.token) {
    try {
      const fullUserData = await getCurrentUser(tokenData.token);
      localStorage.setItem(
        'user',
        JSON.stringify({ ...fullUserData.data.payload, ...tokenData })
      );
    } catch (error) {
      return error;
    }
  }
};

const getCurrentUser = async (token) => {
  const resp = axios.get(`${API_URL}/get`, {
    headers: { authorization: token },
  });
  return resp;
};

const logout = () => {
  localStorage.removeItem("user");
};

const exportedObject = {
  login,
  logout,
  getCurrentUser
};

export default exportedObject;
