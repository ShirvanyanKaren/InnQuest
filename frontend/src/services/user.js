import api from "./api";


/**
 * @author Simran Shetye
 * @date August 8th, 2024
 * @description This service handles user-related tasks such as login, registration, and user profile management.
 */
/**
 * Logs in a user by posting their credentials to the API.
 * 
 * @async
 * @function login
 * @param -The login credentials, typically including a username and password.
 * @returns A promise that resolves to the response from the API or an error.
 */
export const login = async (loginState) => {
    try {
        const response = await api.post("/api/token/", loginState);
        return response;
    } catch (error) {
        return error;
    }
}

/**
 * Registers a new user by posting their signup information to the API and logs them in.
 * 
 * @async
 * @function register
 * @param {Object} signupState - The signup information, including email and password. The email is also used as the username.
 * @returns A promise that resolves to the response from the login function or an error.
 */
export const register = async (signupState) => {
    try {
        signupState['username'] = signupState.email;
        console.log(signupState);
        await api.post("/api/user/", signupState);
        const loginState = { username: signupState.email, password: signupState.password };
        const response = await login(loginState);
        return response;
    } catch (error) {
        return error;
    }
}

// command to create jsdoc documentation for all files under services directory
// jsdoc -r frontend/src/services -d frontend/docs/services
