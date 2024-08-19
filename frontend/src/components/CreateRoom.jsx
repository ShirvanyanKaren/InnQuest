import {useEffect, useState} from 'react';
import { Modal } from 'react-bootstrap';
import { handleAddImageHelper } from '../utils/helpers';

const CreateRoom = ({show, handleClose, setRoomsList}) => {
    const [error, setError] = useState("");
    const [room, setRoom] = useState({
        type: "",
        price: 0,
        quantity: 0,
        sleeps: 0,
        footage: 0,
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
            room.bed_type === ""
        ) {
            setError("Please fill out all fields.");
            return;
        }
        setRoomsList((prev) => [...prev, room]);
        handleClose();
    }

    const handleAddRoomImage = (e) => {
        handleAddImageHelper(e, (images) => setRoom({ ...room, room_images: images }), setError);
    };

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
                        <input
                            type="file"
                            name="room_images"
                            id="room_images"
                            className="form-control"
                            onChange={handleAddRoomImage}
                        />
                    </div>
                    
                    <button type="submit" 
                
                    className="btn btn-primary">
                        Submit
                    </button>
                </form>
                {error && <p className="text-danger">{error}</p>}
            </Modal.Body>
        </Modal>
    )
}


export default CreateRoom;