import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getHotelsByCity } from "../../services/hotels";
import Search from "../components/Search";
import Loading from "../components/Loading";


const Hotels = () => {
    const [params, setSearchParams] = useSearchParams();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        getHotelsByCity({query: params.get("query")})
            .then((response) => {
                console.log(response);
                setHotels(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    , []);

    return loading ? (
        <Loading />
    ): (
        <div className="container mt-3">
            <Search />
            <div className="row mt-2">
                {hotels.map((hotel) => (
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <img src={hotel.image_url} 
                                style={{height: "200px", objectFit: "cover"}}
                                alt={hotel.name} className="img-fluid" />
                                <h5 className="card-title">{hotel.name}</h5>
                                <p className="card-text">{hotel.address}</p>
                                <p className="card-text">{hotel.city}, {hotel.state}</p>
                                <a href={`/hotel/${hotel.id}`} className="btn btn-primary">View Hotel</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}

export default Hotels;