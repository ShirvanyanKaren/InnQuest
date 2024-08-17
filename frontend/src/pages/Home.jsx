import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHotelsByCity } from "../services/hotel";
import { getUserLocation } from "../utils/helpers";
import Search from "../components/Search";
import Auth from "../utils/auth";
import ImagesSlider from "../components/ImageSlider";

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [location, setLocation] = useState("");
  const [allowLocation, setAllowLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  const getGeoLocation = async () => {
    const res = await getUserLocation(setHotels, setLocation);
  };

  useEffect(() => {
    getGeoLocation();
  }, [allowLocation]);

  return loading ? (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <div className="container mt-3">
      <Search />
      {location && (
        <h4 className="text-center mt-2">{location} Hotels</h4>
      )}
      <div className="row">
        {hotels?.map((hotel) => (
          <div className="col-4 mb-3" key={hotel.id}>
            <div className="card h-100">
              <ImagesSlider images={hotel.image_urls} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{hotel.name}</h5>
                <div className="flex-grow-1">
                  <p className="card-text">{hotel.description}</p>
                </div>
                <div className="mt-2">
                  <Link
                    to={`/rooms/${hotel.id}`}
                    className="btn btn-primary"
                    style={{ textDecoration: "none" }}
                    state={hotel}
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
