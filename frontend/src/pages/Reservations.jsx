import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { getReservations, updateReservation, deleteReservation } from "../services/reservation";
import dayjs from "dayjs";
import Auth from "../utils/auth";
import ImagesSlider from "../components/ImageSlider";
const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [currReservation, setReservation] = useState({
    check_in_date: "",
    check_out_date: "",
    num_of_rooms: 0,
  });
  const [show, setShow] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setShow(false);
    setShowCancel(false);
    setReservation({
      check_in_date: "",
      check_out_date: "",
      num_of_rooms: 0,
      id: 0,
    });
    setSuccess("");
    setError("");
  };

  useEffect(() => {
    getReservations().then((response) => {
      const data = response.data;
      for (const reservation of data) {
        let nights = dayjs(reservation.check_out_date).diff(
          dayjs(reservation.check_in_date),
          "day",
        );
        reservation.nights = nights;
      }
      console.log(data);
      setReservations(data);
    });
  }, [currReservation]);

  const submitUpdate = () => {
    updateReservation(currReservation).then((response) => {
      if (response.status === 200) {
        setSuccess("Reservation updated successfully");
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError("Error updating reservation");
      }
    });
  };

  const submitCancel = () => {
    deleteReservation(currReservation.id).then((response) => {
      if (response.status === 204) {
        setSuccess("Reservation cancelled successfully");
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError("Error cancelling reservation");
      }
    });
  };

  const handleShowCancel = (reservation) => {
    return () => {
      setShowCancel(true);
      setReservation({
        check_in_date: reservation.check_in_date,
        check_out_date: reservation.check_out_date,
        num_of_rooms: reservation.num_of_rooms,
        id: reservation.id,
      });
    };
  };

  const handleShow = (reservation) => {
    return () => {
      setShow(true);
      setReservation({
        check_in_date: reservation.check_in_date,
        check_out_date: reservation.check_out_date,
        num_of_rooms: reservation.num_of_rooms,
        id: reservation.id,
      });
    };
  };

  return (
    <div className="container">
      <h1 className="text-center mt-2">Reservations</h1>
      <div className="d-flex flex-wrap justify-content-center">
        {!reservations.length && (
          <h2 className="text-center mt-5">No reservations found</h2>
        )}
        {reservations.map((reservation, index) => {
          return (
            <div key={index} className="card m-2" style={{ width: "18rem" }}>
              <ImagesSlider images={reservation.image_urls} />
              <div className="card-body">
                <h5 className="card-title">{reservation.hotel_name}</h5>
                <p>Check-in: {reservation.check_in_date}</p>
                <p>Check-out: {reservation.check_out_date}</p>
                <p>Number of rooms: {reservation.num_of_rooms}</p>
                <p>Price: {reservation.reservation_price}</p>
                <p>Total nights: {reservation.nights}</p>
              </div>
              <div className="card-footer d-flex justify-content-around">
                <button
                  onClick={handleShow(reservation)}
                  className="btn btn-primary"
                >
                  Update
                </button>
                <button
                  onClick={handleShowCancel(reservation)}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
        <Modal show={showCancel} onHide={() => setShowCancel(false)}>
          <Modal.Header closeButton>
            <Modal.Title> Cancel Reservation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to cancel this reservation?</p>
          </Modal.Body>
          <Modal.Footer>
            {success && <p className="me-2">{success}</p>}
            {error && <p className="me-2">{error}</p>}
            <button 
            onClick={submitCancel}
            className="btn btn-danger">Yes
            </button>
            <button
              onClick={() => setShowCancel(false)}
              className="btn btn-primary"
            >
              No
            </button>
          </Modal.Footer>
        </Modal>
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Reservation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              className="d-flex flex-column"
              onChange={(e) =>
                setReservation({
                  ...currReservation,
                  [e.target.id]: e.target.value,
                })
              }
            >
              <div className="d-flex flex-column">
                <label htmlFor="checkin">Check-in</label>
                <input
                  type="date"
                  id="check_in_date"
                  value={currReservation.check_in_date}
                />
                <label htmlFor="checkout">Check-out</label>
                <input
                  type="date"
                  id="check_out_date"
                  value={currReservation.check_out_date}
                />
                <label htmlFor="numRooms">Number of rooms</label>
                <input
                  type="number"
                  id="num_of_rooms"
                  value={currReservation.num_of_rooms}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            {success && <p className="me-2">{success}</p>}
            {error && <p className="me-2">{error}</p>}
            <button onClick={submitUpdate} className="btn btn-primary">
              Update
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Reservations;
