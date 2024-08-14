import { useEffect, useState } from "react";
import { createReservation } from "../services/reservation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCheck } from "@fortawesome/free-solid-svg-icons";
import { idbPromise } from "../utils/helpers";
import { getHotel } from "../services/hotel";
import Loading from '../components/Loading';
import dayjs from "dayjs";

const Success = () => {
    const [reservation, setReservation] = useState({});
    const [hotel, setHotel] = useState({});
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);



    useEffect(() => {
        let reservation = localStorage.getItem("reservation");
        if (!reservation) window.location.href = "/";
        reservation = JSON.parse(reservation);
        console.log(reservation);
        setReservation(reservation);
        console.log(reservation.hotel, "res");
        getHotel(reservation.hotel).then((response) => {
            console.log(response.data);
            setHotel(response.data[0]);
        });
        setLoading(false);
        saveReservation(reservation);
        localStorage.removeItem("reservation");
    }, []);

    const saveReservation = async (reservation) => {
        const res = await createReservation(reservation);
        const postedReservation = res.data.reservation
        console.log(postedReservation);
        await idbPromise("reservations", "put", postedReservation);
        const getReservations = await idbPromise("reservations", "get");
        console.log(getReservations); 
    }


    return loading ? (
        <Loading />
    ) : (
        <div className='d-flex flex-column justify-content-center'>
            <div className='d-flex justify-content-center'>
            <div className='card mt-4 w-50'>
                <div className='card-header confirmation'
                >
                <h2>innQuest<span style={{color: "skyblue"}}>.com</span>
                
                </h2>
                </div>
                <div className='card-body d-flex flex-column justify-content-center'>
                    <div className='d-flex flex-column'>
                    <h5>
                        <span
                        className="me-2"
                        > 
                        <FontAwesomeIcon icon={faCheckCircle} size='1.5x' color='green' />
                        </span> 
                        Your booking in {hotel.city} is confirmed</h5>
                        <p className='mb-1'>
                            <span className="me-2">
                            <FontAwesomeIcon icon={faCheck} size='1.5x' color='green' />
                            </span>
                            <strong>InnQuest</strong> is looking forward to welcoming you on&nbsp;
                            <strong>
                             {dayjs(reservation.check_in_date).format("MMMM DD")}
                            </strong>
                            </p>
                        <p className='mb-1'>
                            <span className="me-2">
                            <FontAwesomeIcon icon={faCheck} size='1.5x' color='green' />
                            </span>
                            Your <strong>payment</strong> will be handled by {hotel.name}. The total amount is&nbsp;
                            <strong>${reservation.reservation_price.toFixed(2)}</strong>
                        </p>
                        <p className='mb-1'>
                            <span className="me-2">
                            <FontAwesomeIcon icon={faCheck} size='1.5x' color='green' />
                            </span>
                            Email was sent to <strong>{reservation.email}</strong> with your reservation details
                        </p>
                        <p className='mb-1'>
                            <span className="me-2">
                            <FontAwesomeIcon icon={faCheck} size='1.5x' color='green' />
                            </span>
                            You can make changes or view your reservation below
                        </p>
                        <div className='d-flex mt-2'>
                        <button className='btn btn-primary me-2'>View Reservation</button>
                        <button className='btn btn-light'
                        style={{border: '2px solid #004aad'}}
                        >Make Changes</button>
                        </div>
                    </div>
                    <div className='d-flex flex-column mt-3'>
                    <h4>{reservation.hotel_name}</h4>
                    <p className="mb-1">{hotel.city}, {hotel.country}</p>
                    <p className='mb-1'>{hotel.address}</p>
                    <img 
                    className="mt-2"
                    style={{height: '200px', objectFit: 'cover', border : '1px solid black', borderRadius: '5px'}}
                    src={reservation.image_url} alt={reservation.hotel_name} />
                    <div className='text-decoration-none mt-3 reservation-details '>
                        <li className='list-group-item'>
                            <strong>Your Reservation</strong>:
                            <span className="float-end">
                                {reservation.num_of_rooms > 1 ? `${reservation.num_of_rooms} rooms` : `${reservation.num_of_rooms} room`}
                                {reservation.nights > 1 ? ` for ${reservation.nights} nights` : ` for ${reservation.nights} night`}
                            </span>
                            </li>
                            <li className='list-group-item'>
                                <strong>Check-in</strong>:
                                <span className="float-end">
                                    {dayjs(reservation.check_in_date).format("MMMM DD, YYYY")} (from 11:00)
                                </span>
                            </li>
                            <li className='list-group-item'>
                                <strong>Check-out</strong>:
                                <span className="float-end">
                                    {dayjs(reservation.check_out_date).format("MMMM DD, YYYY")} (until 12:00)
                                </span>
                            </li>
                            <li className='list-group-item'>
                                <strong>Price</strong>:
                                <span className="float-end">
                                    ${reservation.reservation_price.toFixed(2)} 
                                </span>
                            </li>
                            <li className='list-group-item'>
                                <strong>Prepayment</strong>
                                <span className="float-end">You will be charged a prepayment of the hotel at anytime</span>
                            </li>
                        <button className="btn btn-danger mt-3">Cancel Reservation</button>
                        
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );


}

export default Success;