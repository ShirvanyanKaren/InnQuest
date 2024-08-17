import { jwtDecode } from "jwt-decode";

class AuthService {
  /**
   * Date: (August 8th, 2024)
   * Author: Porfirio Tavira
   * Description: This service handles authentication-related tasks such as login, logout, token management, and user profile retrieval. 
   * It interacts with JWT tokens stored in local storage to manage user sessions.
   */

  getProfile() {
    /**
     * @return: Decoded JWT payload
     * Description: This method retrieves the current user's profile by decoding the stored JWT token.
     * It relies on the getToken method to fetch the token from local storage.
     */

    return jwtDecode(this.getToken());
  }

  loggedIn() {
    /**
     * @return: Boolean indicating if the user is logged in
     * Description: This method checks if the user is logged in by verifying the presence of a valid, non-expired JWT token.
     * It returns true if the token exists and is not expired, otherwise it returns false.
     */

    const token = this.getToken();
    return token && !this.isTokenExpired(token) ? true : false;
  } 

  isTokenExpired(token) {
    /**
     * @param token: JWT token string
     * @return: Boolean indicating if the token is expired
     * Description: This method checks whether a given JWT token has expired. 
     * It decodes the token to get its expiration time and compares it with the current time. 
     * If the token is expired, it removes the token from local storage and returns true.
     */

    const decoded = jwtDecode(token);

    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("access_token");
      return true;
    }

    return false;
  }

  getToken() {
    /**
     * @return: JWT token string
     * Description: This method retrieves the JWT token from local storage. 
     * It is used by other methods to access the stored token.
     */

    return localStorage.getItem("access_token");
  }

  isSuperUser() {
    /**
     * @return: Boolean indicating if the user is a superuser
     * Description: This method checks if the current user is a superuser by examining the decoded JWT token.
     * It returns true if the user is a superuser, otherwise it returns false.
     */

    const token = this.getToken();
    const decoded = jwtDecode(token);
    return decoded.is_superuser;
  }

  async login(idToken) {
    /**
     * @param idToken: JWT token string
     * Description: This method handles the login process by storing the provided JWT token in local storage and redirecting the user to the home page.
     * It clears any previous token before storing the new one.
     */

    localStorage.removeItem("access_token");
    localStorage.setItem("access_token", idToken);
    const decoded = jwtDecode(idToken);
    if (decoded.is_superuser) window.location.href = "/admin";
    else window.location.href = "/";
    
  }

  async logout() {
    /**
     * Description: This method handles the logout process by decoding the JWT token, removing it from local storage, and reloading the page.
     * The decoded token can be logged to the console for debugging purposes.
     */
    
    const tokenId = jwtDecode(localStorage.getItem("access_token"));
    console.log(tokenId);
    localStorage.removeItem("access_token");
    window.location.reload();
  }
}

export default new AuthService();
