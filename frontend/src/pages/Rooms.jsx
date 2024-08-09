import { useState, useEffect } from "react";
import { getHotelRooms } from "../services/hotels";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { getHotel } from "../services/hotels";
import ToolTip from "../components/ToolTip";
import HotelCard from "../components/HotelCard";
import ImagesSlider from "../components/ImageSlider";
import api from "../services/api";
import Loading from "../components/Loading";
import dayjs from "dayjs";

const Rooms = () => {
    const [loading, setLoading] = useState(true);
    const [rooms, setRooms] = useState([]);
    const [show, setShow] = useState(false);
    const [params, setSearchParams] = useSearchParams();
    const [numRooms, setNumRooms] = useState(1);
    const [reservationPrice, setReservationPrice] = useState(0);
    const location = useLocation();
    const [error, setError] = useState("");
    const hotelState = location.state || {};
    const [hotelId, setHotelId] = useState("");
    const [numBeds, setNumBeds] = useState("allRooms");

    useEffect(() => {
        const hotelId = window.location.pathname.split("/")[2];
        const params = { hotel_id: hotelId };
        setHotelId(hotelId);
        getHotelRooms(params).then((response) => {
          console.log(response.data);
          setRooms(response?.data);
          setLoading(false);
        });
      }, []);
    
  const handleClose = () => {
    setShow(false);
    setError("");
  };


  const handleFilter = (e) => {
    const filter = e.target.id;
    console.log(filter);
    setNumBeds(filter);
  }



  return (
    <div className="container">
      {loading ? (
        <Loading />
      ) : rooms.length === 0 ? (
        <h2 className="text-center mt-5">No rooms found</h2>
      ) : (
        <div className="container">
          <HotelCard hotel={hotelState} hotelId={hotelId} />
          <div className="d-flex justify-content-start mt-3">
          <button className={`btn btn-light me-2 ${numBeds=="allRooms" ? "active" : ""}`}
          id="allRooms"
          onClick={handleFilter}
          >All rooms</button>
          <button className={`btn btn-light me-2 ${numBeds=="oneRoom" ? "active" : ""}`}
          id="oneRoom"
          onClick={handleFilter}
          >One room</button>
          <button className={`btn btn-light ${numBeds=="twoRooms" ? "active" : ""}`}
          id="twoRooms"
          onClick={handleFilter}
          >Two rooms</button>
          </div>
          <div className="row">
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
