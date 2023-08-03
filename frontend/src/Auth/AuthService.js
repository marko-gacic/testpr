import { loginUser } from "./api";

class AuthService {
  constructor() {
    this.isLoggedIn = false;
  }

  async login(username, password) {
    try {
      const response = await loginUser({ username, password });
      const token = response.token;

      if (token) {
        localStorage.setItem("token", token);
        this.isLoggedIn = true;
        return true;
      }
    } catch (error) {
      console.error(error);
    }

    return false;
  }

  logout() {
    localStorage.removeItem("token");
    this.isLoggedIn = false;
  }

  getToken() {
    return localStorage.getItem("token");
  }

  isAuthenticated() {
    return this.isLoggedIn;
  }
}

export default new AuthService();
