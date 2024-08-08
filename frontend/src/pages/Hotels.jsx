import { useState, useEffect } from "react";
import { getHotelsByCity, getHotelRooms } from "../services/hotels";
import { useSearchParams } from "react-router-dom";
import { stateAbbreviations } from "../utils/helpers";
import { Link } from "react-router-dom";
import ImagesSlider from "../components/ImageSlider";
import dayjs from "dayjs";
import Search from "../components/Search";
import ToolTip from "../components/ToolTip";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setSearchParams] = useSearchParams();
  const [error, setError] = useState("");
  const popularAmenities = ["Pool", "Breakfast Included", "Hot Tub", "Gym"];

  const [filter, setFilter] = useState({
    amenities: new Set(),
    min_price: params.get("min_price") || 0,
    max_price: params.get("max_price") || 1000,
  });
   
  useEffect(() => {
      setSearchParams({
        min_price : filter.min_price || 0,
        max_price : filter.max_price || 1000,
        rooms: params.get("rooms") || 1,
        query: params.get("query") || "Los Angeles",
        check_in: params.get("check_in") || dayjs(new Date()).toISOString().split("T")[0],
        check_out: params.get("check_out") || dayjs(new Date()).add(2, "day").toISOString().split("T")[0],
        amenities: params.get("amenities") || ""
    });
    const amenitiesFilter = params.get("amenities").split(",");
    filter.amenities = new Set(amenitiesFilter);
    setHotelData();
  }, [params]);



  const setHotelData = async () => {
    const hotelParams = {}
    hotelParams.query = params.get("query");
    hotelParams.amenities = params.get("amenities").slice(1);
    hotelParams.check_in = params.get("check_in");
    hotelParams.check_out = params.get("check_out");
    hotelParams.rooms = params.get("rooms");
    hotelParams.min_price = params.get("min_price");
    hotelParams.max_price = params.get("max_price");
    const response = await getHotelsByCity(hotelParams)
    const hotelData = response.data;
    for (const hotel of hotelData) {
      if (hotel.rooms) hotel.rooms.sort((a, b) => a.price - b.price);
    }
    setHotels(hotelData);
    setLoading(false);
  };

  const handleCheck = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const filterAmenities = new Set(filter.amenities);
    if (filterAmenities.has(value)) filterAmenities.delete(value);
    else filterAmenities.add(value);
    setFilter({ ...filter, amenities: filterAmenities });
    const amenitiesUrl = Array.from(filterAmenities).join(",");
    console.log(params.get("rooms"));
    setSearchParams({
      query: params.get("query"),
      check_in: params.get("check_in"),
      check_out: params.get("check_out"),
      rooms: params.get("rooms"),
      amenities: amenitiesUrl,
      min_price: params.get("min_price"),
      max_price: params.get("max_price"),
    });
  }

  const submitPriceChange = (e) => {
    e.preventDefault();
    if (Number(filter.max_price) < 299) setFilter({ ...filter, min_price: 100, max_price: 299 });
    if (Number(filter.min_price) > Number(filter.max_price)) setFilter({ ...filter, min_price: Number(filter.min_price), max_price: Number(filter.min_price) * 1.8 });
    if (Number(filter.min_price) > 837) setFilter({ ...filter, min_price: 400, max_price: 1000 });
    setSearchParams({
      query: params.get("query"),
      check_in: params.get("check_in"),
      check_out: params.get("check_out"),
      rooms: params.get("rooms"),
      amenities: params.get("amenities"),
      min_price: filter.min_price,
      max_price: filter.max_price,
    });
  }

  const handlePriceChange = (e) => {
    e.preventDefault();
    const { id, value} = e.target;
    setError("");
    setFilter({ ...filter, [id]: value });
  }


  return loading ? (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <div className="container">
      <Search />
      {hotels.length === 0 ? (
        <h2 className="text-center mt-5">No Hotels Found for {params.get("query")}</h2>
      ) : (
      <h2 className="text-center mt-5 d-flex flex-row justify-content-center">
        Search Results for
        <span>
          <p className="search-term font-italic ms-1">{params.get("query")}</p> 
        </span>
      </h2>
      )}
      <div className="row mt-4">
        <div className="col-lg-4">
          <h4 className="text-center">Filter by</h4>
          <div className="filter-box">
            <div className="card-body">
              <form>
              <h5 className="card-title mb-3">Popular Categories</h5>
              <div className="checkbox-form">
                {popularAmenities.map((amenity) => (
                  <div className="form-check mt-2" key={amenity}>
                    <input
                      className="form-check-input"  
                      type="checkbox"
                      value={amenity}
                      checked={filter.amenities.has(amenity)}
                      onChange={handleCheck}
                      id={amenity}
                    />
                    <ToolTip amenity={amenity} description={amenity} />
                  </div>
                ))}
              </div>
              </form>
            </div>

            <div className="card-body mt-4">
              <h5 className="card-title">Price</h5>
            <form onSubmit={submitPriceChange}>
            <div className="d-flex justify-content-between">
                <div className="form-group">
                  <label htmlFor="minPrice">Min</label>
                  <input
                    type="number"
                    className="form-control"
                    id="min_price"
                    value={filter.min_price}
                    min={1}
                    onChange={handlePriceChange}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="maxPrice">Max</label>
                  <input
                    type="number submit"
                    className="form-control"
                    id="max_price"
                    value={filter.max_price}
                    onChange={handlePriceChange}
                    min={1}
                    placeholder="1000"
                  />
                </div>
                </div>
                <div className="">
                <button type="submit" className="btn btn-primary mt-2 ">Submit</button>
                </div>
                </form>
                {error && <p className="text-danger">{error}</p>}
            </div>
            </div>    
        </div>
        <div className="col-lg-8">
          {hotels.map((hotel) => (
            <div className="col-lg-12" key={hotel.id}>

                <div className="card mt-3">
                  <div className="row no-gutters">
                    <div className="col-md-4">
                    <ImagesSlider images={hotel.image_urls} 
                    />
                    </div>
                    <div className="col-md-8">
                    <Link
                to={`/rooms/${hotel.id}?check_in=${params.get("check_in")}&check_out=${params.get("check_out")}&rooms=${params.get("rooms")}`}
                state={hotel}
                style={{ textDecoration: "none", color: "black" }}
              >
                      <div className="card-body">
                        <h5 className="card-title">{hotel.name}</h5>
                        <p className="card-text">{hotel.description}</p>
                        <p className="card-text">
                          {hotel.address}, {hotel.city}{" "}
                          {stateAbbreviations[hotel.state]}
                        </p>
                        <div className="d-flex">
                        {hotel?.amenities.map((amenity) => (
                          <div 
                          className="m-1"
                          key={amenity}>
                          <ToolTip amenity={amenity} />
                          </div>
                        ))}
                        </div>
                        {hotel?.rooms?.length > 0 && (
                          <>
                        <p className="card-text mt-2">
                          <strong>
                            Rooms at ${hotel?.rooms[0]?.price} per night
                          </strong>
                        </p>
                        <p className="card-text">
                          <strong>Rooms Left:</strong>{" "}
                          {hotel.rooms[0].available_rooms}
                        </p>
                        </>
                        )}
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hotels;
