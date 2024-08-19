import api from './api';



export const createRooms = async (data, hotelId) => {
    try {
        const responses = [];
        for (const room of data) {
            room.hotel = hotelId;
            console.log(room)
            const response = await api.post('/api/room/', room);
            responses.push(response);
            console.log(response);
        }
        return responses;

    }
    catch (error) {
        return error;
    }
}


export const editRoom = async (data) => {
    try {
        const response = await api.put(`/api/room/${data.id}/`, data);
        return response;
    }
    catch (error) {
        return error;
    }
}



