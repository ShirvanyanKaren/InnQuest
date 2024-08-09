import { useEffect, useState } from "react";
import { createReservation } from "../services/reservation";

const Success = () => {
    const [reservation, setReservation] = useState({});
    useEffect(() => {
        let reservation = localStorage.getItem("reservation");
        if (!reservation) {
            window.location.href = "/";
        }
        reservation = JSON.parse(reservation);
        setReservation(reservation);
        console.log(reservation);
        createReservation(reservation).then((response) => {
            console.log(response);
        });
        localStorage.removeItem("reservation");
    }, []);


    return (
        <div className='d-flex flex-column justify-content-center'>
            <h1 className='text-center mt-5'>Success!</h1>
            <div className='d-flex justify-content-center'>
            <div className='card'>
                <div className='card-header text-center'>
                <h2>Reservation Details</h2>
                </div>
                <div className='card-body p-4 d-flex flex-column justify-content-center'>
                    <img 
                    style={{height: '200px', objectFit: 'cover', border : '1px solid black', borderRadius: '5px'}}
                    src={reservation.image_url} alt={reservation.hotel_name} />
                    <div className='text-center'>
                    <h4>{reservation.hotel_name}</h4>
                    <p>Check-in: {reservation.check_in_date}</p>
                    <p>Check-out: {reservation.check_out_date}</p>
                    <p>Number of rooms: {reservation.num_of_rooms}</p>
                    <p>Price: {reservation.reservation_price}</p>
                    <p>Total nights: {reservation.nights}</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );


}

export default Success;