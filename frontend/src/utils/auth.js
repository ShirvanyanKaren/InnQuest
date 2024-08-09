import { jwtDecode } from "jwt-decode";

class AuthService {
  getProfile() {
    return jwtDecode(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token) ? true : false;
  } 

  isTokenExpired(token) {
    // Decode the token to get its expiration time that was set by the server
    const decoded = jwtDecode(token);
    console.log(decoded);
    // If the expiration time is less than the current time (in seconds), the token is expired and we return `true`
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("access_token");
      return true;
    }
    // If token hasn't passed its expiration time, return `false`
    return false;
  }

  getToken() {
    return localStorage.getItem("access_token");
  }

  async login(idToken) {
    localStorage.removeItem("access_token");
    localStorage.setItem("access_token", idToken);
    window.location.assign("/");
  }

  async logout() {
    const tokenId = jwtDecode(localStorage.getItem("access_token"));
    console.log(tokenId);
    localStorage.removeItem("access_token");
    window.location.reload();
  }
}

export default new AuthService();
