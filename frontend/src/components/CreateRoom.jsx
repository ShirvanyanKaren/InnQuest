import {useEffect, useState} from 'react';
import { Modal } from 'react-bootstrap';
import { getImage, uploadImages } from "../utils/s3";
import { handleAddImageHelper, handleDeleteImageHelper } from '../utils/helpers';


const CreateRoom = ({show, handleClose, setRoomsList}) => {
    const [error, setError] = useState("");
    const [room, setRoom] = useState({
        type: "",
        price: 0,
        quantity: 0,
        sleeps: 0,
        footage: 0,
        image_urls: [],
        room_images: [],
        beds: 0,
        bed_type: ""
    });



    const handleChange = (e) => {
        setRoom({ ...room, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        setError("");
        e.preventDefault();
        if (
            room.type === "" ||
            room.price === "" ||
            room.quantity === 0 ||
            room.sleeps === 0 ||
            room.footage === 0 ||
            room.beds === 0 ||
            room.bed_type === "" ||
            room.image_urls.length === 0
        ) {
            setError("Please fill out all fields.");
            return;
        }
        const imageUrls = room.image_urls.length ? await uploadImages(room.image_urls) : [];
        room.room_images = imageUrls;
        console.log(room);
        setRoomsList((prev) => [...prev, room]);
        handleClose();
    }

    const handleAddImage = (e) => {
        handleAddImageHelper(e, room, setRoom, setError);
    }

    const handleDeleteImage = (index) => {
        handleDeleteImageHelper(index, room, setRoom);
    }




    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Room</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <input
                            type="text"
                            name="type"
                            id="type"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            min={100}
                            max={1000}
                            name="price"
                            id="price"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            name="quantity"
                            id="quantity"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sleeps">Sleeps</label>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            name="sleeps"
                            id="sleeps"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="footage">Footage</label>
                        <input
                            type="number"
                            min={100}
                            max={1000}
                            name="footage"
                            id="footage"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="beds">Beds</label>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            name="beds"
                            id="beds"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bed_type">Bed Type</label>
                        <input
                            type="text"
                            name="bed_type"
                            id="bed_type"
                            className="form-control"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="room_images">Room Images</label>
                        {room.image_urls.length > 0 && room.image_urls.map((image, index) => (
                            <div key={index} className="d-flex align-items-center">
                                <img src={image.url} alt={image.name} style={{ width: "50px", height: "50px" }} />
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteImage(index)}>X</button>
                            </div>
                        ))}

                    </div>
                    <div className="form-group">
                        <input
                            type="file"
                            name="room_images"
                            id="room_images"
                            className="form-control"
                            onChange={handleAddImage}
                        />
                    </div>
                    <button type="submit" 
                    className="btn btn-primary mt-3">
                        Submit
                    </button>
                </form>
                {error && <p className="text-danger">{error}</p>}
            </Modal.Body>
        </Modal>
    )
}


export default CreateRoom;