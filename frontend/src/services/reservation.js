import api from "./api";
import { getHotel } from "./hotel";

export const goToCheckout = async (resInfo) => {
    try {
        const response = await api.post("/api/checkout/", resInfo);
        return response;
    } catch (error) {
        return error;
    }
}
export const createReservation = async (resInfo) => {
    try {
        const response = await api.post("/api/reservation/", resInfo);
        return response;
    } catch (error) {
        return error;
    }
}
export const getReservations = async () => {
    try {
        const response = await api.get("/api/reservation/");
        for (const reservation of response.data) {
            console.log(reservation.hotel);
            const hotel = await getHotel(reservation.hotel);
            reservation.hotel_name = hotel.data[0].name;
            reservation.image_urls = hotel.data[0].image_urls;
        }
        return response;
    } catch (error) {
        return error;
    }
}

export const updateReservation = async (resInfo) => {
    try {
        console.log(resInfo);
        const response = await api.put(`/api/reservation/${resInfo.id}/`, resInfo);
        return response;
    } catch (error) {
        return error;
    }
}


export const deleteReservation = async (id) => {
    try {
        const response = await api.delete(`/api/reservation/${id}/`);
        return response;
    } catch (error) {
        return error;
    }
}
