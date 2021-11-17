import TokenService from "../services/token.service";

export default function authHeader() {
  const user = TokenService.getUser();

  if (user && user.token) {
    return { authorization: user.token };
  } else {
    return {};
  }
}
