import api from "./api";

/**
 * @author Karen Shirvanyan
 * @date August 8th, 2024
 * @description This service handles hotel-related tasks such as fetching hotels, hotel rooms, and hotel details.
 */

/**
 * Fetches a list of hotels based in a specified city using query parameters.
 * 
 * @async
 * @function getHotelsByCity
 * @param {Object} params - The query parameters for filtering hotels by city.
 * @returns A promise that resolves to the response from the API or an error.
 */
export const getHotelsByCity = async (params) => {
    try {
        console.log(params);
        const response = await api.get("/api/hotel/", {
            params: params
        });
        return response;
    } catch (error) {
        return error;
    }
}

/**
 * Fetches a specific hotel by its ID.
 * 
 * @async
 * @function getHotel
 * @param {number|string} id - The ID of the hotel to retrieve.
 * @returns A promise that resolves to the response from the API or an error.
 */
export const getHotel = async (id) => {
    try {
        const response = await api.get(`/api/hotel/`, {
            params: {
                hotel_id: id,
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}

/**
 * Fetches a list of rooms available in hotels based on provided parameters.
 * 
 * @async
 * @function getHotelRooms
 * @param {Object} params - The query parameters for filtering available hotel rooms.
 * @returns A promise that resolves to the response from the API or an error.
 */
export const getHotelRooms = async (params) => {
    try {
        console.log(params);
        const response = await api.get('/api/room/', {
            params: params
        });
        return response;
    } catch (error) {
        return error;
    }
}
