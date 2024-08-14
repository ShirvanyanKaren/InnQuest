import {
    UPDATE_HOTELS,
    UPDATE_SEARCHES
} from './actions';
export const initialState = {
    viewedHotels: {},
    recentSearches: {},
    reservations: {}
}

export const reducer = (state= initialState, action) => {
    switch (action.type) {
        case UPDATE_HOTELS:
            return {
                ...state,
                viewedHotels: action.viewedHotels
            };
        case UPDATE_SEARCHES:
            return {
                ...state,
                recentSearches: action.recentSearches
            };
        default:
            return state;
    }
};
