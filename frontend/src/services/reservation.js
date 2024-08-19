import api from "./api";
import { getHotel } from "./hotel";


/**
 * @author Robert Paronyan
 * @date August 8th, 2024
 * @description This service handles reservation-related tasks such as creating, updating, and deleting reservations.
 */

/**
 * Initiates the checkout process by posting reservation information to the API.
 * 
 * @async
 * @function goToCheckout
 * @param {Object} resInfo - The reservation information required for checkout.
 * @returns A promise that resolves to the response from the API or an error.
 */
export const goToCheckout = async (resInfo) => {
    try {
        const response = await api.post("/api/checkout/", resInfo);
        return response;
    } catch (error) {
        return error;
    }
}

/**
 * Creates a new reservation by posting reservation information to the API.
 * 
 * @async
 * @function createReservation
 * @param {Object} resInfo - The reservation information required to create a reservation.
 * @returns A promise that resolves to the response from the API or an error.
 */
export const createReservation = async (resInfo) => {
    try {
        const response = await api.post("/api/reservation/", resInfo);
        return response;
    } catch (error) {
        return error;
    }
}

/**
 * Retrieves all reservations and enriches them with hotel details such as name and image URLs.
 * 
 * @async
 * @function getReservations
 * @returns A promise that resolves to the response from the API or an error.
 */
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

/**
 * Updates an existing reservation with new information by sending a PUT request to the API.
 * 
 * @async
 * @function updateReservation
 * @param {Object} resInfo - The updated reservation information.
 * @returns A promise that resolves to the response from the API or an error.
 */
export const updateReservation = async (resInfo) => {
    try {
        console.log(resInfo);
        const response = await api.put(`/api/reservation/${resInfo.id}/`, resInfo);
        return response;
    } catch (error) {
        return error;
    }
}

/**
 * Deletes an existing reservation by sending a DELETE request to the API.
 * 
 * @async
 * @function deleteReservation
 * @param {number|string} id - The ID of the reservation to delete.
 * @returns A promise that resolves to the response from the API or an error.
 */
export const deleteReservation = async (id) => {
    try {
        const response = await api.delete(`/api/reservation/${id}/`);
        return response;
    } catch (error) {
        return error;
    }
}

/**
 * Retrieves all reservations for a given month.
 * 
 * @async
 * @function getReservationsByMonth
 * @param {number} months - The number of months to retrieve reservations for.
 * @returns A promise that resolves to the response from the API or an error.
 */


export const getReservationsByMonth = async (start, end) => {
    try {
        const response = await api.get('/api/reservation/', {
            params: {
                start: start,
                end: end
            }
        }
        );
        return response;
    }
    catch (error) {
        return error;
    }
}

export const getReservationRevenueByMonth = async (start, end) => {
    try {
        const response = await api.get('/api/reservation/', {
            params: {
                revenue_start: start,
                end: end
            }
        }
        );
        return response;
    }
    catch (error) {
        return error;
    }
}
