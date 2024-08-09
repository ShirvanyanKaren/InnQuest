import api from "./api";

export const login = async (loginState) => {
    try {
        const response = await api.post("/api/token/", loginState);
        return response;
    } catch (error) {
        return error
    }
}


export const register = async (signupState) => {
    try {
        signupState['username'] = signupState.email;
        console.log(signupState);
        await api.post("/api/user/", signupState);
        const loginState = { username: signupState.email, password: signupState.password};
        const response = await login(loginState);
        return response;
    } catch (error) {
        return error;
    }
    }
