import api from "./api";

export const goToCheckout = async (resInfo) => {
    try {
        const response = await api.post("/api/checkout/", resInfo);
        return response;
    } catch (error) {
        return error;
    }
}