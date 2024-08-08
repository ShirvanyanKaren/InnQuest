import api from "./api";


export const getHotelsByCity = async (params) => {
    try {
        console.log(params);
        const response = await api.get("/api/hotel/",{
            params: params
        });
        return response;
        } catch (error) {
            return error;
        }
}


export const getHotel = async (id) => {
    try {
        const response = await api.get(`/api/hotel/`, {
            params: {
                hotel_id : id,
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}

export const getHotelRooms = async (params) => {
    try {
        console.log(params);
        const response = await api.get('/api/room/', {
            params: params
        });
        return response;
    }
    catch (error) {
        return error;
    }
}