import { Modal } from "react-bootstrap";
import { useState, useEffect, lazy } from "react";
import { createHotel } from "../services/hotel";
import { amenitiesMap } from "./ToolTip";
import { getImage, uploadImages } from "../utils/s3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleAddImageHelper, handleDeleteImageHelper } from "../utils/helpers";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CreateRoom from "./CreateRoom";
import fs from "fs";
import ToolTip from "./ToolTip";

const CreateHotel = ({ show, handleClose }) => {
  const [amenities, setAmenities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState({
    name: "",
    city: "",
    state: "",
    description: "",
    country: "",
    image_urls: [],
    address: "",
    amenities: [],
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showRoomsModal, setShowRoomsModal] = useState(false);

  const handleChange = (e) => {
    setHotel({ ...hotel, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setAmenities([]); 
  }, [show]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      hotel.name === "" ||
      hotel.city === "" ||
      hotel.state === "" ||
      hotel.description === "" ||
      hotel.country === "" ||
      hotel.image_urls === ""
    ) {
      setError("Please fill out all fields.");
      return;
    }
    const imageUrls = await uploadImages(hotel.image_urls);
    hotel.amenities = amenities;
    hotel.image_urls = imageUrls;
    console.log(hotel);
    const response = await createHotel(hotel);
    if (response.status === 201) {
      setSuccess(true);
      set
    }
  };

  const handleAmenityClick = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((item) => item !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const amenitiesGrid = Object.keys(amenitiesMap).map((amenity) => {
    return (
      <div
        className="col-3 amenites-checkbox fs-5"
        onClick={() => handleAmenityClick(amenity)}
        key={amenity}
      >
        <ToolTip
          key={amenity}
          amenity={amenity}
          color={amenities.includes(amenity) ? "#f7fafc" : ""}
          backgroundColor={amenities.includes(amenity) ? "#004aad" : ""}
        />
      </div>
    );
  });

  const handleAddImage = (e) => {
    handleAddImageHelper(e, hotel, setHotel, setError);
  };

  const handleDeleteImage = (index) => {
    handleDeleteImageHelper(index, hotel, setHotel);
  }
  
  return (
    <Modal show={show} onHide={handleClose}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered>

      <Modal.Header closeButton>
        <Modal.Title>Create Hotel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}
        className="p-2"
        >
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              name="city"
              id="city"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              name="state"
              id="state"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              className="form-control"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="price">Country</label>
            <input
              type="text"
              name="country"
              id="country"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Images</label>
            {hotel.image_urls.length > 0 && hotel.image_urls.map((image, index) => (
                <div key={index} className="card w-50 mb-1">
                    <img src={image.url} alt="hotel" style={{ width: "100px", objectFit: "cover"}} />
                    <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteImage(index)}
                    >
                    Remove
                    </button>
                </div>
                ))}
            <input
                type="file"
                name="images"
                id="images"
                className="form-control"
                onChange={handleAddImage}
                multiple
            />
          </div>
          <div className="form-group">
            <label htmlFor="amenities" className="mt-1 mb-1">
              Amenities
            </label>
            {amenities?.map((amenity) => (
              <div key={amenity}>
                <p className="mt-0">{amenity}</p>
              </div>
            ))}
            <div className="d-flex flex-wrap p-3">{amenitiesGrid}</div>
          </div>
          <div className="form-group d-flex flex-column">
            <label htmlFor="">Add Rooms</label>
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={() => setShowRoomsModal(true)}
              style={{ width: "30%" }}
              > <span className="">
                <FontAwesomeIcon icon={faPlus} />
                </span> 
                Add Room
              </button>
            </div>
            <div className="d-flex">
            {rooms?.map((room) => (
              <div key={room} className="card w-50 m-2">
                <div className="card-body">
                <p className="mt-0">
                    Room Type: {room.type}</p>
                <p className="mt-0">
                    Price: {room.price}</p>
                <p className="mt-0">
                    Sleeps:
                    {room.sleeps}</p>
                <p className="mt-0">
                    Footage: {room.footage}</p>
                <p className="mt-0">
                    Beds: {room.beds}</p>
                <p className="mt-0">
                    Bed Type: {room.bed_type}</p>
               </div>
               <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                    const newRooms = rooms.filter((r) => r !== room);
                    setRooms(newRooms);
                }
                }
                >
                Remove
                </button>

              </div>
            ))}
            </div>


          <button
            type="submit"
            className="btn btn-primary mt-3"
            onClick={handleSubmit}
          >
            Create Hotel
          </button>
          {success && (
            <p className="text-success mt-2">Hotel created successfully!</p>
          )}
          {error && <p className="text-danger mt-2">{error}</p>}
        </form>
        <CreateRoom show={showRoomsModal} handleClose={() => setShowRoomsModal(false)} setRoomsList={setRooms} />
      </Modal.Body>
    </Modal>

  );
};

export default CreateHotel;
