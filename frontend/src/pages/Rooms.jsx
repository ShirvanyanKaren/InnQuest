import { useState, useEffect } from "react";
import { getHotelRooms } from "../services/hotels";
import { useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { goToCheckout } from "../services/reservation";
import { useSearchParams } from "react-router-dom";
import { getHotel } from "../services/hotels";
import ToolTip from "../components/ToolTip";
import HotelCard from "../components/HotelCard";
import ImagesSlider from "../components/ImageSlider";
import dayjs from "dayjs";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
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
    console.log(hotelState);
    const hotelId = window.location.pathname.split("/")[2];
    const params = { hotel_id: hotelId };
    setHotelId(hotelId);
    getHotelRooms(params).then((response) => {
      console.log(response.data);
      setRooms(response?.data);
      setLoading(false);
    });
  }, []);

  
  const handleFilter = (e) => {
    const filter = e.target.id;
    console.log(filter);
    setNumBeds(filter);
  }

  const filterRooms = () => {
    return (
    <>
    {rooms.filter(room => {
      if (numBeds == "allRooms") return room;
      else if (numBeds == "oneRoom") return room.beds == 1;
      else if (numBeds == "twoRooms") return room.beds == 2;

    }).map(room => (
      <div className="col-md-4" key={room.id}>
        <div className="card mt-3">
          <ImagesSlider images={room.room_images} />
          <div className="card-body" key={room.id}>
            <h5 className="card-title">{room.type}</h5>
            <div className="d-flex flex-column">
            <ToolTip amenity={"Bed"} description={`${room.beds} ${room.bed_type} ${room.beds > 1 ? "Beds" : "Bed"}`} />
            <ToolTip amenity={"Guests"} description={`Sleeps ${room.sleeps}`} />
            <ToolTip amenity={"Footage"} description={`${room.footage} sq ft`} />
            </div>
            <div className="d-flex justify-content-between">
            <h3 className="card-text">${room.price}</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShow(true)}
            >
              Reserve
            </button>
            </div>
          </div>
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                />
              </div>
            <div className="form-group">
              <label htmlFor="checkin">Check-in</label>
              <input
                type="date"
                className="form-control"
                min={new Date().toISOString().split("T")[0]}
                id="check_in"
                defaultValue={params.get("check_in")}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="checkout">Check-out</label>
              <input
                type="date"
                className="form-control"
                min={dayjs(params.get("check_in") || new Date())
                  .add(1, "day")
                  .format("YYYY-MM-DD")}
                id="check_out"
                defaultValue={params.get("check_out")}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="numRooms">Number of Rooms</label>
              <input
                type="number"
                min={1}
                className="form-control"
                id="rooms"
                value={Number(params.get("rooms"))}
                defaultValue={Number(params.get("rooms"))}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="total">Total</label>
              <input
                type="text"
                className="form-control bg-light"
                id="total"
                value={`$${
                  reservationPrice ||
                  (room.price * Number(params.get("rooms")) * 1.1).toFixed(2)
                }`}
                disabled
              />
            </div>
            <div className="d-flex justify-content-center mt-3">
              <label htmlFor="error" className="text-danger">
                {error}
              </label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => setShow(false)}
            >
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => getCheckoutSession(room)}
            >
              Book
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    ))}
    </>
  )
  }



  const handleClose = () => {
    setShow(false);
    setError("");
  };

  const handleChange = (e) => {
    if (e.target.id === "rooms") {
      setReservationPrice(
        (rooms[0]?.price * e.target.value * 1.1).toFixed(2),
      );
      console.log(reservationPrice, rooms[0]?.price, e.target.value);
    } 
    const newParams = new URLSearchParams(params);
    newParams.set(e.target.id, e.target.value);
    setSearchParams(newParams);
  }

  const getCheckoutSession = async (room) => {
    const missingFields = [];
    if (!params.get("check_in")) missingFields.push("check-in");
    if (!params.get("check_out")) missingFields.push("check-out");
    if (!params.get("rooms")) missingFields.push("number of rooms");
    if (missingFields.length) {
      const error = `Please select the ${missingFields.join(", ")}`;
      setError(error);
      return;
    }
    let resPrice = (room.price * Number(params.get("rooms")) * 1.1).toFixed(2);
    const hotelId = window.location.pathname.split("/")[2];
    const hotelName = hotelState.name || await getHotel(hotelId).then((response) => response.data[0].name);
    console.log(hotelName);
    const nights = dayjs(params.get("check_out")).diff(dayjs(params.get("check_in")), "day");
    const reservation = {
      hotel_name: hotelName,
      image_url: room.room_images[0],
      nights: nights,
      reservation_price: Number(resPrice),
      check_in_date: params.get("check_in"),
      check_out_date: params.get("check_out"),
      num_of_rooms: Number(params.get("rooms")),
      room: room.id,
      hotel: Number(hotelId),
    };
    localStorage.setItem("reservation", JSON.stringify(reservation));
    const response = await goToCheckout(reservation);
    const url = response.data.url;
    window.location.replace(url);
  };

  return (
    <div className="container">
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
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
            {filterRooms()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
