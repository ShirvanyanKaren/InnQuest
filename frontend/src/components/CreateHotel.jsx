import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { createHotel } from "../services/hotel";
import { amenitiesMap } from "./ToolTip";
import ToolTip from "./ToolTip";

const CreateHotel = ({ show, handleClose }) => {
    const [amenities, setAmenities] = useState([]);
    const [hotel, setHotel] = useState({
        name: "",
        city: "",
        state: "",
        description: "",
        country: "",
        image: "",
        address: "",
        amenities: [],  
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setHotel({ ...hotel, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        setAmenities([]);
    }, [show]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(hotel);
        if (hotel.name === "" || hotel.city === "" || hotel.state === "" || hotel.description === "" || hotel.country === "" || hotel.image === "") {
            setError("Please fill out all fields.");
            console.log("here");
            return;
        }
        hotel.amenities = amenities;
        const response = await createHotel(hotel);
        console.log("here");
        if (response.status === 201) {
            setSuccess(true);
            handleClose();
        }
    };

    const handleAmenityClick = (amenity) => {
        if (amenities.includes(amenity)) {
            setAmenities(amenities.filter((item) => item !== amenity));
        } else {
            setAmenities([...amenities, amenity]);
        }
    }

    const amenitiesGrid = Object.keys(amenitiesMap).map((amenity) => {
        return (
            <div className="col-3 amenites-checkbox fs-5"
            onClick={() => handleAmenityClick(amenity)}
             key={amenity}>
            <ToolTip key={amenity} amenity={amenity}
            color={amenities.includes(amenity) ? "#f7fafc" : ""}
            backgroundColor={amenities.includes(amenity) ? "#004aad" : ""}
            />
            </div>
        );
    }
    );
    
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Hotel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
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
                        <label htmlFor="image">Image</label>
                        <input
                            type="text"
                            name="image"
                            id="image"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amenities"
                        className="mt-1 mb-1"
                        >Amenities</label>
                        {amenities?.map((amenity) => (
                            <div key={amenity}>
                                <p
                                className="mt-0"
                                >{amenity}</p>
                            </div>
                        ))}
                        <div className="d-flex flex-wrap p-3">
                            {amenitiesGrid}
                        </div>
                        </div>
                    <button type="submit" className="btn btn-primary mt-3"
                    onClick={handleSubmit}>
                        Create Hotel
                    </button>
                    {success && <p className="text-success mt-2">Hotel created successfully!</p>}
                    {error && <p className="text-danger mt-2">{error}</p>}
                </form>
            </Modal.Body>
        </Modal>
    );

}

export default CreateHotel;